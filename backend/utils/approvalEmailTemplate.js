const approvalEmailTemplate = ({
  name,
  company,
  purpose,
  visitDate,
  approveLink,
  rejectLink,
}) => {
  return `
  <div style="font-family: Arial, sans-serif; background:#f4f6f8; padding:30px">
    <div style="max-width:600px; margin:auto; background:#ffffff; border-radius:10px; overflow:hidden">

      <!-- HEADER -->
      <div style="background:#0f172a; padding:20px; text-align:center">
        <h2 style="color:#ffffff; margin:0">THEJO Visitor Approval</h2>
      </div>

      <!-- BODY -->
      <div style="padding:24px">
        <p style="font-size:15px; color:#334155">
          Hello,
        </p>

        <p style="font-size:15px; color:#334155">
          A visitor has requested to meet you. Please review the details below and take action.
        </p>

        <table style="width:100%; margin-top:20px; border-collapse:collapse">
          <tr>
            <td style="padding:8px 0; color:#64748b">Name</td>
            <td style="padding:8px 0; font-weight:600">${name}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#64748b">Company</td>
            <td style="padding:8px 0; font-weight:600">${company}</td>
          </tr>
          <tr>
            <td style="padding:8px 0; color:#64748b">Purpose</td>
            <td style="padding:8px 0; font-weight:600">${purpose}</td>
          </tr>
          ${
            visitDate
              ? `
          <tr>
            <td style="padding:8px 0; color:#64748b">Visit Date</td>
            <td style="padding:8px 0; font-weight:600">${visitDate}</td>
          </tr>
          `
              : ""
          }
        </table>

        <!-- ACTION BUTTONS -->
        <div style="margin-top:30px; text-align:center">
          <a href="${approveLink}"
             style="display:inline-block; padding:12px 22px; margin-right:10px;
                    background:#16a34a; color:#ffffff; text-decoration:none;
                    border-radius:6px; font-weight:600">
            Approve
          </a>

          <a href="${rejectLink}"
             style="display:inline-block; padding:12px 22px;
                    background:#dc2626; color:#ffffff; text-decoration:none;
                    border-radius:6px; font-weight:600">
            Reject
          </a>
        </div>

        <p style="margin-top:30px; font-size:13px; color:#64748b">
          This is an automated message from THEJO Visitor Management System.
        </p>
      </div>

    </div>
  </div>
  `;
};

module.exports = approvalEmailTemplate;
