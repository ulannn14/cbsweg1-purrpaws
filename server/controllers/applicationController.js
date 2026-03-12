const prisma = require("../config/prisma");


// CREATE APPLICATION
exports.createApplication = async (req, res) => {
  try {

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
        response16: new Date(response16)
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

  } catch (error) {
    console.error("Create application error:", error);
    res.status(500).json({ message: "Failed to create application" });
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