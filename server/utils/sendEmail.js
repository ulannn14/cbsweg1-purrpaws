const axios = require("axios");

async function sendApplicationEmail({ application, status, notes }) {
  try {
    const userEmail = application?.user?.email;
    const org = application?.pet?.organization;
    const pet = application?.pet;

    // ✅ fallback email (IKAW)
    const fallbackEmail = "your-email@gmail.com";

    let message = "";
    let extra = "";

    // 🟡 PENDING
    if (status === "PENDING") {
      message = `Your application for <b>${pet?.name}</b> has been submitted.`;
      extra = `
        <p>The organization will review your application and contact you soon.</p>
      `;
    }

    // 🔵 UNDER REVIEW
    else if (status === "UNDER_REVIEW") {
      message = `Your application is now under assessment.`;
      extra = `
        <h3>📌 Message from the Organization</h3>
        <p>${notes || "No additional comments provided."}</p>
      `;
    }

    // 🟢 APPROVED
    else if (status === "APPROVED") {
      message = `🎉 Congratulations! Your application for <b>${pet?.name}</b> has been approved.`;
      extra = `
        <h3>📌 Message from the Organization</h3>
        <p>${notes || "No additional comments provided."}</p>
      `;
    }

    // 🔴 REJECTED
    else if (status === "REJECTED") {
      message = `😔 We're sorry. Your application for <b>${pet?.name}</b> was not approved.`;
      extra = `
        <h3>📌 Message from the Organization</h3>
        <p>${notes || "No additional comments provided."}</p>
      `;
    }

    // ✅ ALWAYS SEND (fallback if missing)
    const finalRecipient = userEmail || fallbackEmail;

    await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: `${org?.name || "PurrPaws"} via PurrPaws`,
          email: "noreply@purrpaws.online",
        },

        // ✅ always has value
        to: [{ email: finalRecipient }],

        // ✅ optional CC
        cc: [
          ...(org?.email ? [{ email: org.email }] : []),
          { email: "rlsrainmackenlhy142005@gmail.com" },
          { email: "liancarlosmbarte@gmail.com" }
        ],
        // ✅ safe replyTo
        replyTo: org?.email
          ? { email: org.email }
          : { email: "noreply@purrpaws.online" },

        subject: `[PurrPaws] Application Update`,

        htmlContent: `
          <div style="font-family: Arial;">
            <h2>🐾 PurrPaws</h2>

            <p>${message}</p>

            <p>Status: <b>${status}</b></p>

            <hr/>

            ${extra}

            <br/>
            <p style="color: gray;">
              You can reply to this email to contact the organization.
            </p>
          </div>
        `,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log(`✅ Email sent to ${finalRecipient}`);
  } catch (error) {
    // ❌ DO NOT CRASH — just log
    console.error("❌ Email failed (non-blocking):", error.response?.data || error.message);
  }
}

module.exports = sendApplicationEmail;