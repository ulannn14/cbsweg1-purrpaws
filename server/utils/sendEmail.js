const axios = require("axios");

async function sendApplicationEmail({ application, status, notes }) {
  try {
    const userEmail = application?.user?.email;
    const org = application?.pet?.organization;
    const pet = application?.pet;

        // 🐾 QUESTIONS
    const QUESTIONS = [
      { label: "Residence Type", field: "response1" },
      { label: "Occupation", field: "response2" },
      { label: "Why adopt?", field: "response3" },
      { label: "Experience with pets", field: "response4" },
      { label: "Preparation steps", field: "response5" },
      { label: "Vet clinic", field: "response6" },
      { label: "Planned diet", field: "response7" },
      { label: "Other pets", field: "response8" },
      { label: "Consent status", field: "response9" },
      { label: "Consent understanding", field: "response10" },
      { label: "Pets neutered", field: "response11" },
      { label: "Plan to neuter", field: "response12" },
      { label: "Agree to updates", field: "response13" },
      { label: "Agree emergency updates", field: "response14" },
      { label: "Share on social", field: "response15" },
      { label: "Interview time", field: "response16", type: "date" }
    ];

    // 🐾 BUILD HTML
    const qaHtml = QUESTIONS.map((q) => {
      let answer = application?.[q.field] || "N/A";

      if (q.type === "date" && answer !== "N/A") {
        answer = new Date(answer).toLocaleString();
      }

      return `
        <p><b>${q.label}:</b> ${answer}</p>
      `;
    }).join("");

    const fallbackEmail = "rlsrainmackenlhy142005@gmail.com";

    let message = "";
    let extra = "";

    // 🟡 PENDING
    if (status === "PENDING") {
      message = `
        <div>
          <p style="font-size:18px; color:#ff9900;"><b><i>Greetings!</i></b> 🐶🐱</p>
          <p>Thank you for your interest in adopting through PurrPaws. We truly appreciate the time and effort you put into your application.</p>
          <p>Your application for <b>${pet?.name}</b> has been successfully submitted and is now awaiting review.</p>
          <p>You will receive updates on the status of your application as it progresses through the review process.</p>
          <p>━━━━━━━━━━━━━━━━━━━━━━━</p>
          <p>🐾 <b><u>APPLICATION RESULT</u></b></p>
          <p>🟡 <b>Status: <span style="color:#f1c232;">PENDING</span></b></p>
          <p>📌 <b>Note:</b> ${notes || "Your application has been received and is in queue for assessment."}</p>
          <p>━━━━━━━━━━━━━━━━━━━━━━━</p>
          <p>🐾 <b><u>APPLICATION DETAILS</u></b></p>
          ${qaHtml}
          <p>━━━━━━━━━━━━━━━━━━━━━━━</p>
        </div>
      `;

      extra = `
        <p>Our team will carefully review your application to ensure the best possible match for both you and the pet.</p>
        <p>We appreciate your patience during this process. You will be notified once there are updates regarding your application.</p>
        <p>Thank you for choosing to adopt and for giving pets a chance at a loving home.</p>
        <p><b><i>
          <span style="color:#38761d;">Adopt with </span>
          <span style="color:#e69138;">PurrPaws</span>
        </i></b> 🐾</p>
        <p><b>PurrPaws Team</b></p>
      `;
    }

    // 🔵 UNDER REVIEW
    else if (status === "UNDER_REVIEW" || status === "UNDER REVIEW") {
      message = `
        <div>
          <p style="font-size:18px; color:#ff9900;"><b><i>Greetings!</i></b> 🐶🐱</p>
          <p>Thank you again for your interest in adopting through PurrPaws.</p>
          <p>Your application for <b>${pet?.name}</b> is currently under review by the organization.</p>
          <p>See possible note below or wait for the organization to contact you for more information.</p>
          <p>━━━━━━━━━━━━━━━━━━━━━━━</p>
          <p>🐾 <b><u>APPLICATION RESULT</u></b></p>
          <p>🔵 <b>Status: <span style="color:#0b5394;">UNDER REVIEW</span></b></p>
          <p>📌 <b>Note:</b> ${notes || "Your application is currently being assessed."}</p>
          <p>━━━━━━━━━━━━━━━━━━━━━━━</p>
        </div>
      `;

      extra = `
        <p>Our team is carefully evaluating your application to ensure the best possible match for both you and the pet.</p>
        <p>We appreciate your patience and understanding during this process. We will notify you as soon as a decision has been made.</p>
        <p>Thank you for your interest in giving a pet a loving home.</p>
        <p><b><i>
          <span style="color:#38761d;">Adopt with </span>
          <span style="color:#e69138;">PurrPaws</span>
        </i></b> 🐾</p>
        <p><b>PurrPaws Team</b></p>
      `;
    }

    // 🟢 APPROVED
    else if (status === "APPROVED") {
      message = `
        <div>
          <p style="font-size:18px; color:#ff9900;"><b><i>Greetings!</i></b> 🐶🐱</p>
          <p>Thank you again for your interest in adopting through PurrPaws.</p>
          <p>Your application for <b>${pet?.name}</b> has been approved by the organization.</p>
          <p>See possible note below or wait for the organization to contact you with next steps.</p>
          <p>━━━━━━━━━━━━━━━━━━━━━━━</p>
          <p>🐾 <b><u>APPLICATION RESULT</u></b></p>
          <p>🟢 <b>Status: <span style="color:#38761d;">APPROVED</span></b></p>
          <p>📌 <b>Reason:</b> ${notes || "You are a great match for this pet!"}</p>
          <p>━━━━━━━━━━━━━━━━━━━━━━━</p>
        </div>
      `;

      extra = `
        <p>Congratulations! The organization will reach out to you soon with the next steps for the adoption process.</p>
        <p>We're excited for you and your future companion, and we wish you a wonderful journey ahead together.</p>
        <p>Thank you for choosing adoption and for giving a pet a loving home.</p>
        <p><b><i>
          <span style="color:#38761d;">Adopt with </span>
          <span style="color:#e69138;">PurrPaws</span>
        </i></b> 🐾</p>
        <p><b>PurrPaws Team</b></p>
      `;
    }

    // 🔴 REJECTED
    else if (status === "REJECTED") {
      message = `
        <div>
          <p style="font-size:18px; color:#ff9900;"><b><i>Greetings!</i></b> 🐶🐱</p>

          <p>Thank you for your interest in adopting through PurrPaws. We truly appreciate the time and effort you put into your application.</p>

          <p>We regret to inform you that your application for <b>${pet?.name}</b> has not been approved.</p>

          <p>━━━━━━━━━━━━━━━━━━━━━━━</p>

          <p>🐾 <b><u>APPLICATION RESULT</u></b></p>

          <p>🔴 <b>Status: <span style="color:#ff0000;">REJECTED</span></b></p>

          <p>📌 <b>Reason:</b> ${notes || "No specific reason was provided."}</p>

          <p>━━━━━━━━━━━━━━━━━━━━━━━</p>
        </div>
      `;

      extra = `
        <p>This decision was made after careful review of your application to ensure the best possible match for both the pet and adopter.</p>

        <p>We understand this may be disappointing. However, we encourage you to explore other pets available for adoption, as a different match may better suit your current situation. You are also welcome to submit another application in the future.</p>

        <p>Thank you for your understanding and for your interest in giving a pet a loving home.</p>

        <p><b><i>
          <span style="color:#38761d;">Adopt with </span>
          <span style="color:#e69138;">PurrPaws</span>
        </i></b> 🐾</p>

        <p><b>PurrPaws Team</b></p>
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
          { email: "liancarlosmbarte@gmail.com" },
          { email: "leighalbo23@gmail.com" },
          { email: "matthew_fajardo@dlsu.edu.ph"}
        ],
        // ✅ safe replyTo
        replyTo: org?.email
          ? { email: org.email }
          : { email: "noreply@purrpaws.online" },

        subject: `[PurrPaws] Application Update`,

        htmlContent: `
          <div>
            ${message}
            ${extra}

            <p style="color: gray;">
              You can reply to this email to communicate with each other.
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

    console.log(`Email sent to ${finalRecipient}`);
  } catch (error) {
    // ❌ DO NOT CRASH — just log
    console.error("Email failed (non-blocking):", error.response?.data || error.message);
  }
}

module.exports = sendApplicationEmail;