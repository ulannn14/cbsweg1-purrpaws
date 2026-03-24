const prisma = require("../config/prisma");
const supabase = require("../config/supabase");

console.log("PRISMA OBJECT:", supabase);

// CREATE APPLICATION
exports.createApplication = async (req, res) => {
  try {
    const files = req.files || {};

    console.log("BODY:", req.body);
    console.log("FILES:", files);

    const uploadedFiles = {
      validId: [],
      consentProof: [],
      housePhotos: []
    };

    // ✅ helper function
    const uploadToSupabase = async (fileArray, folder) => {
      const urls = [];

      for (const file of fileArray || []) {
        const fileName = `${Date.now()}-${file.originalname}`;

        const { data, error } = await supabase.storage
          .from("public-assets")
          .upload(`${folder}/${fileName}`, file.buffer, {
            contentType: file.mimetype
          });

        if (error) throw error;

        const publicUrl = supabase.storage
          .from("public-assets")
          .getPublicUrl(data.path).data.publicUrl;

        urls.push(publicUrl);
      }

      return urls;
    };

    // ✅ upload files
    uploadedFiles.validId = await uploadToSupabase(files.validId, "validId");
    uploadedFiles.consentProof = await uploadToSupabase(files.consentProof, "consentProof");
    uploadedFiles.housePhotos = await uploadToSupabase(files.housePhotos, "housePhotos");

    console.log("UPLOADED:", uploadedFiles);

    // ✅ extract form fields
    const {
      userId,
      petId,

      applicantFirstName,
      applicantLastName,
      applicantAddress,
      applicantPhoneNumber,
      applicantEmail,
      applicantBirthdate,

      applicantOccupation,
      applicantCompany,
      applicantSocialMedia,
      applicantCivilStatus,
      adoptionPrompt,

      alternateContactName,
      alternateContactRelationship,
      alternateContactNumber,
      alternateContactEmail,

      response1,
      response2,
      response3,
      response4,
      response5,
      response6,
      response7,
      response8,
      response9,
      response10,
      response11,
      response12,
      response13,
      response14,
      response15,
      response16
    } = req.body;

    // ✅ SAVE TO DATABASE (🔥 THIS WAS MISSING)
    const application = await prisma.adoptionApplication.create({
      data: {
        userId,
        petId,

        applicantFirstName,
        applicantLastName,
        applicantAddress,
        applicantPhoneNumber,
        applicantEmail,
        applicantBirthdate: new Date(applicantBirthdate),

        applicantOccupation,
        applicantCompany,
        applicantSocialMedia,
        applicantCivilStatus,
        adoptionPrompt,

        alternateContactName,
        alternateContactRelationship,
        alternateContactNumber,
        alternateContactEmail,

        response1,
        response2,
        response3,
        response4,
        response5,
        response6,
        response7,
        response8,
        response9,
        response10,
        response11,
        response12,
        response13,
        response14,
        response15,
        response16: new Date(response16),

        // 🔥 FILE URLS SAVED HERE
        validIdUrls: uploadedFiles.validId,
        consentProofUrls: uploadedFiles.consentProof,
        housePhotosUrls: uploadedFiles.housePhotos
      },
      include: {
        user: true,
        pet: {
          include: {
            breed: true,
            organization: true
          }
        }
      }
    });

    res.status(201).json(application);

  } catch (err) {
    console.error(err);
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
            organization: true
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
            organization: true
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
            organization: true
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

exports.approveApplication = async (req, res) => {
  try {

    const { id } = req.params;

    const application = await prisma.adoptionApplication.update({
      where: { id },
      data: {
        status: "APPROVED"
      }
    });

    // mark pet as adopted
    await prisma.pet.update({
      where: { id: application.petId },
      data: {
        adoptionStatus: "ADOPTED"
      }
    });

    // reject other applications for the same pet
    await prisma.adoptionApplication.updateMany({
      where: {
        petId: application.petId,
        id: { not: id }
      },
      data: {
        status: "REJECTED"
      }
    });

    res.json({ message: "Application approved. Pet adopted." });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to approve application" });
  }
};

exports.updateApplicationStatus = async (req, res) => {

  try {

    const { id } = req.params;
    const { status } = req.body;

    const application = await prisma.adoptionApplication.update({
      where: { id },
      data: { status }
    });

    res.json(application);

  } catch (error) {

    console.error(error);
    res.status(500).json({ message: "Failed to update application status" });

  }

};