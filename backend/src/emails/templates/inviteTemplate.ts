export const inviteTemplate = (inviteLink: string) => {
  return `
  <div style="background-color:#f0f0f0; padding:30px 0; text-align:center;">
    <div style="background-color:white; max-width:500px; margin:0 auto; padding:30px; border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">
      <p style="font-size:16px; color:#333;">You have been invited to a project on <strong style="color:#1f4985;">Prodly</strong>.</p>
      <p style="font-size:16px; color:#333;">Click the button to join:</p>
      <a href="${inviteLink}" style="
        display:inline-block;
        padding:12px 20px;
        background-color:#1f4985;
        color:white;
        text-decoration:none;
        border-radius:6px;
        font-weight:bold;
        margin:20px 0;">Join the project</a>
    </div>
  </div>
  `;
};
