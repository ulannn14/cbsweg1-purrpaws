const prisma = require("../config/prisma");
const supabase = require("../config/supabase");
const sendApplicationEmail = require("../utils/sendEmail");

//console.log("PRISMA OBJECT:", supabase);

exports.createApplication = async (req, res) => {
  try {
    const files = req.files || {};

    console.log("BODY:", req.body);
    console.log("FILES:", files);

    const uploadedFiles = {
      validId: [],
      consentProof: [],
      housePhotos: [],
    };

    // Upload helper
    const uploadToSupabase = async (fileArray, folder) => {
      const urls = [];

      for (const file of fileArray || []) {
        const fileName = `${Date.now()}-${file.originalname}`;

        const { data, error } = await supabase.storage
          .from("public-assets")
          .upload(`${folder}/${fileName}`, file.buffer, {
            contentType: file.mimetype,
          });

        if (error) throw error;

        const publicUrl = supabase.storage
          .from("public-assets")
          .getPublicUrl(data.path).data.publicUrl;

        urls.push(publicUrl);
      }

      return urls;
    };

    // 📁 Upload files
    uploadedFiles.validId = await uploadToSupabase(files.validId, "validId");
    uploadedFiles.consentProof = await uploadToSupabase(files.consentProof, "consentProof");
    uploadedFiles.housePhotos = await uploadToSupabase(files.housePhotos, "housePhotos");

    console.log("UPLOADED:", uploadedFiles);

    // 🧾 Extract fields
    const {
      userId,
      petId,

      applicantFirstName,
      applicantLastName,
      applicantAddress,
      applicantPhoneNumber,
      applicantEmail,
      applicantBirthdate,
    } = req.body;

    const applicationData = {
      userId,
      petId,

      applicantFirstName,
      applicantLastName,
      applicantAddress,
      applicantPhoneNumber,
      applicantEmail,
      applicantBirthdate: new Date(applicantBirthdate),

      validIdUrls: uploadedFiles.validId,
      consentProofUrls: uploadedFiles.consentProof,
      housePhotosUrls: uploadedFiles.housePhotos,
    };

    // Map responses
    Object.keys(req.body).forEach((key) => {
      if (key.startsWith("response")) {
        const value = req.body[key];

        if (value === undefined) return;

        if (key === "response16") {
          const parsedDate = new Date(value);
          if (!isNaN(parsedDate)) {
            applicationData[key] = parsedDate;
          }
        } else {
          applicationData[key] = value;
        }
      }
    });

    console.log("ValidId:", applicationData.validIdUrls);
    console.log("ConsentProof:", applicationData.consentProofUrls);
    console.log("HousePhotos:", applicationData.housePhotosUrls);

    // Create application
    const application = await prisma.adoptionApplication.create({
      data: applicationData,
      include: {
        user: true,
        pet: {
          include: {
            breed: true,
            organization: {
              include: {
                province: true
              }
            },
          },
        },
      },
    });

    // SEND EMAIL (PENDING) — NON-BLOCKING
    Promise.resolve().then(() =>
      sendApplicationEmail({
        application,
        status: "PENDING",
        notes: null,
      })
    );

    // Response
    res.status(201).json(application);

  } catch (err) {
    console.error("CREATE APPLICATION ERROR:", err);
    res.status(500).json({ error: err.message });
  }
};


// ADOPTER: GET MY APPLICATIONS
exports.getMyApplications = async (req, res) => {
  try {

    const { userId } = req.params;

    const applications = await prisma.adoptionApplication.findMany({
      where: {
        userId: userId
      },
      include: {
        pet: {
          include: {
            breed: true,
            organization: {
              include: {
                province: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(applications);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch user applications" });
  }
};



// ORGANIZATION: GET APPLICATIONS FOR THEIR PETS
exports.getOrgApplications = async (req, res) => {
  try {

    const { orgId } = req.params;

    const applications = await prisma.adoptionApplication.findMany({
      where: {
        pet: {
          organizationId: orgId
        }
      },
      include: {
        user: true,
        pet: {
          include: {
            breed: true,
            organization: {
              include: {
                province: true
              }
            }
          }
        }
      },
      orderBy: {
        createdAt: "desc"
      }
    });

    res.json(applications);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch organization applications"
    });
  }
};



// GET SINGLE APPLICATION
exports.getApplicationById = async (req, res) => {
  try {

    const { id } = req.params;

    const application = await prisma.adoptionApplication.findUnique({
      where: {
        id: id
      },
      include: {
        user: true,
        pet: {
          include: {
            breed: true,
            organization: {
              include: {
                province: true
              }
            }
          }
        }
      }
    });

    if (!application) {
      return res.status(404).json({
        message: "Application not found"
      });
    }

    res.json(application);

  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Failed to fetch application"
    });
  }
};

exports.updateApplicationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status, notes } = req.body;

    // ✅ Direct mapping (no more ASSESSMENT)
    const mappedStatus = status;

    const validStatuses = ["PENDING", "UNDER_REVIEW", "APPROVED", "REJECTED"];

    if (!validStatuses.includes(mappedStatus)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    // ✅ update selected application
    const application = await prisma.adoptionApplication.update({
      where: { id },
      data: {
        status: mappedStatus,
        comment: notes?.trim() || null,
      },
      include: {
        user: true,
        pet: {
          include: {
            organization: {
              include: {
                province: true
              }
            }
          },
        },
      },
    });

    // 🔥 IF APPROVED → handle adoption logic
    if (mappedStatus === "APPROVED") {

      // 🐾 mark pet as adopted
      await prisma.pet.update({
        where: { id: application.petId },
        data: {
          adoptionStatus: "ADOPTED",
        },
      });

      // 📦 get other applications
      const otherApps = await prisma.adoptionApplication.findMany({
        where: {
          petId: application.petId,
          id: { not: id },
        },
        include: {
          user: true,
          pet: {
            include: {
              organization: {
                include: {
                  province: true
                }
              },
            },
          },
        },
      });

      // ❌ reject all others
      await prisma.adoptionApplication.updateMany({
        where: {
          petId: application.petId,
          id: { not: id },
        },
        data: {
          status: "REJECTED",
        },
      });

      // 📩 email rejected applicants (non-blocking)
      otherApps.forEach((app) => {
        Promise.resolve().then(() =>
          sendApplicationEmail({
            application: app,
            status: "REJECTED",
            notes: "Another applicant has been selected for adoption.",
          })
        );
      });
    }

    // 📩 email current applicant (non-blocking)
    Promise.resolve().then(() =>
      sendApplicationEmail({
        application,
        status: mappedStatus,
        notes,
      })
    );

    res.json(application);

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update application status" });
  }
};