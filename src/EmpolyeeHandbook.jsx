import React from "react";
import Footer from "./Footer";
import Header from "./Header";

const EmployeeHandbook = () => {
  return (
 <div className="min-h-screen flex flex-col bg-gray-50 text-gray-800 leading-relaxed">
  <header>
    <Header />
  </header>

  <main className="flex-grow pt-20">
    <div className="w-full bg-white py-8 px-4 lg:px-8">
      <div className="max-w-screen-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-4 text-center">
          RFR Professionals International Group Limited – Employee Handbook
        </h1>

        {/* Download PDF Button */}
        <div className="text-center mb-8">
          <a
            href="/rfr.handbook.pdf"
            download
            className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded transition"
          >
            Download PDF
          </a>
        </div>

        import React from "react";


      {/* Section: Welcome */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Welcome to RFR Professionals International Group Ltd</h2>
        <p>
          The Staff Handbook is designed to provide you with information about RFR Professionals
          International Group Limited and details of your employment. The Staff Handbook also
          contains the policies, procedures and rules, which the organisation has adopted and
          you are expected to follow as a member of the team.
        </p>
        <p className="mt-2">
          A number of the policies, procedures and rules included in the Staff Handbook are referred
          to in your contract of employment. Some form part of your contract of employment and some
          do not. The handbook specifies which are contractual. It is important to read this carefully.
        </p>
        <p className="mt-2">
          For questions, contact <strong>Paul Hula (Director)</strong>.
        </p>
        <p className="mt-2">
          The handbook will be updated as and when changes occur.
        </p>
      </section>

      {/* Acknowledgement */}
      <section className="mb-8 bg-green-400">
        <h2 className="text-xl font-semibold mb-2">Acknowledgement</h2>
        <p>
          Please complete the tear-off slip below and return it to <strong>Emmanuel Rominiyi (Senior Partner)</strong>
          to acknowledge receipt of your copy of the Staff Handbook.
        </p>
        <div className="border border-gray-300 p-4 mt-4 rounded">
          <p><strong>To: Emmanuel Rominiyi</strong></p>
          <p className="mt-2">Name: ____________________________</p>
          <p className="mt-2">
            I hereby acknowledge receipt of the RFR Professionals International Group Limited Staff Handbook. I understand and accept that, where specified, the policies, procedures and rules contained in the Staff Handbook form part of my contract of employment.
          </p>
          <p className="mt-2">Signed: ____________________________</p>
          <p className="mt-2">Date: ____________________________</p>
        </div>
      </section>


        {/* About RFR Professionals */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">About RFR Professionals International Group Limited</h2>
        <p>
          RFR Professionals is an international group of consultants in Strategy and Change Management;
          Governance, Risk and Control; Enterprise Risk Management; Risk-Based Internal Audit; Tax Advisory;
          Industry-Specific Advisory; External Statutory Audit; Financial Accounting and Reporting;
          Business Consulting (IT Solutions and ERP); and Finance Shared Services.
        </p>
        <p className="mt-2">
          Our partners, principals, and associates are seasoned professionals with years of experience in
          various sectors, including aviation, retail, hospitality, oil and gas, IT, and telecommunications
          across 70+ countries.
        </p>
        <p className="mt-2">
          Our unique value proposition is delivering value-added advisory using subject matter experts
          and innovative strategies.
        </p>
      </section>

      {/* Equal Opportunities Statement */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Equal Opportunities Statement</h2>
        <p>
          RFR Professionals International Group Limited is committed to encouraging diversity and eliminating
          discrimination both as an employer and a provider of services.
        </p>
        <p className="mt-2">
          We provide equality and fairness to all in employment and do not discriminate on the grounds of:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Gender or gender reassignment</li>
          <li>Marital or civil partnership status</li>
          <li>Race, ethnic origin, or nationality</li>
          <li>Disability or health conditions</li>
          <li>Sexual orientation or religion</li>
          <li>Age</li>
        </ul>
        <p className="mt-2">
          All managers are expected to understand and uphold this policy. Opportunities such as flexible
          working, open recruitment, and reasonable accommodations will be available wherever feasible.
        </p>
      </section>

      {/* Right to Work */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Right to Work</h2>
        <p>
          To work for RFR International, you must provide documentation showing your right to work in the UK. Documents
          are verified for consistency, expiration, authenticity, and legal status.
        </p>
        <p className="mt-2 font-semibold">Acceptable Documents (examples):</p>
        <ul className="list-disc list-inside mt-2">
          <li>UK or EEA passport</li>
          <li>Residence permit or biometric card</li>
          <li>Birth or adoption certificate with National Insurance proof</li>
          <li>Home Office verification notices</li>
        </ul>
        <p className="mt-2">
          You must also inform HR if names differ across documents, with supporting evidence (e.g. marriage certificate).
        </p>
      </section>


      {/* Dignity at Work */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Dignity at Work</h2>
        <p>
          RFR Professionals International Group Limited believes that the work environment must always
          support the dignity and respect of individuals. Complaints of harassment will be taken seriously
          and investigated promptly.
        </p>
      </section>

      {/* What and How of Harassment */}
      <section className="mb-8">
        <h3 className="text-xl font-semibold mb-2">What and How of Harassment</h3>
        <p>
          Harassment is unwanted, offensive conduct that affects an individual’s dignity at work. It can be
          physical, verbal, written, or non-verbal.
        </p>
        <p className="mt-2 font-semibold">Grounds may include:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Race, ethnicity, or nationality</li>
          <li>Gender or sexual orientation</li>
          <li>Religion or political beliefs</li>
          <li>Disabilities or health conditions (e.g., HIV/AIDS)</li>
          <li>Age</li>
          <li>Membership of a union or challenging harassment</li>
        </ul>
        <p className="mt-2 font-semibold">Forms may include:</p>
        <ul className="list-disc list-inside mt-1">
          <li>Unwanted physical contact</li>
          <li>Offensive jokes, gossip, slurs, or gestures</li>
          <li>Exclusion from work/social activities</li>
          <li>Bullying or coercion</li>
          <li>Spying or stalking</li>
        </ul>
        <p className="mt-2">
          Victims are encouraged to keep detailed records and report incidents to their line manager
          or their manager’s superior if needed.
        </p>
      </section>

      {/* Joining RFR */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Joining RFR Professionals International Group Limited</h2>

        <h3 className="text-xl font-semibold mt-4 mb-1">Probationary Period</h3>
        <p>
          New employees serve a 3-month probation. During this period, either party may terminate employment
          with one week’s notice. Probation may be extended.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Induction</h3>
        <p>
          Induction will help you settle in, meet your colleagues, and understand your terms of employment,
          health and safety, and RFR’s policies.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Changes to Personal Details</h3>
        <p>
          Always inform HR (<a className="text-blue-600 underline" href="mailto:hr@rfrprofessionals.com">hr@rfrprofessionals.com</a>)
          of any changes to your personal details using the official form. Your information is confidential
          and only shared with your permission.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Criminal Records Checks</h3>
        <p>
          Some roles require background checks, especially those involving children or vulnerable adults.
          You will be informed during your recruitment if this applies.
        </p>
      </section>


      {/* Pay */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Pay</h2>

        <h3 className="text-xl font-semibold mt-4 mb-1">Payment of Salaries</h3>
        <p>
          Salaries are paid via BACS transfer on the 1st day of each calendar month. Payslips will show
          gross pay, deductions, and net pay.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Deductions from Salaries</h3>
        <p>
          Statutory deductions or those authorized in writing will be made. Adjustments may also apply
          for overpayments or malicious damage.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Pensions</h3>
        <p>Pending.</p>
      </section>

      {/* Hours of Work & TOIL */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Hours of Work</h2>
        <p>
          Normal hours are stated in your contract. Full-time employees work 39 hours/week.
          If you work another job, the Working Time Regulations 1998 may apply.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Time Off in Lieu (TOIL)</h3>
        <p>
          With prior approval, extra hours worked can be offset with TOIL. This time off should
          be taken promptly to avoid build-up.
        </p>
      </section>

      {/* Holidays */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Holidays</h2>

        <h3 className="text-xl font-semibold mt-4 mb-1">Entitlement</h3>
        <p>
          Full-time employees are entitled to 28 days of holiday per year (including public holidays).
          Part-time employees receive a pro-rata amount. Maximum 2 weeks may be taken at a time unless
          under special circumstances.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Holiday Year</h3>
        <p>
          Runs from April 1 to March 31. Unused leave will be lost unless explicit permission is given
          to carry it over.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Public & Bank Holidays</h3>
        <p>
          You are entitled to public holidays as part of your 28-day leave. For part-time staff,
          entitlement is proportional. Days include:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>New Year's Day</li>
          <li>Good Friday</li>
          <li>Easter Monday</li>
          <li>May Day</li>
          <li>Spring Bank Holiday</li>
          <li>Late Summer Bank Holiday</li>
          <li>Christmas Day</li>
          <li>Boxing Day</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-1">Holiday Booking</h3>
        <p>
          Submit holiday requests in advance using the Holiday Request Form. Minimum notice
          is twice the length of the leave requested (e.g., 2 weeks notice for 1 week off).
        </p>
        <p className="mt-2">
          HR may deny requests with equal notice. Holidays are granted on a first-come,
          first-served basis. Unused leave should be taken before departure; otherwise,
          a deduction or payout may apply.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Religious Holidays</h3>
        <p>
          You are free to take religious holidays using part of your normal leave entitlement.
          RFR does not discriminate based on religion.
        </p>
      </section>

      {/* Sickness Absence */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Sickness Absence Policy</h2>
        <p>
          RFR values health and attendance. We provide reasonable support and confidentiality.
          Absence should be reported promptly and followed up with certification.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Reporting</h3>
        <p>
          Notify your line manager as early as possible on the first day of sickness.
          If unavailable, contact HR at <strong>07379043536</strong>.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Certification</h3>
        <p>
          Absences must be documented with a self-certificate for up to 7 days.
          Afterward, a medical certificate is required. Gaps may be considered
          unauthorized absence.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Return to Work</h3>
        <p>
          Submit a Self-Certification Form and attend a return-to-work discussion
          to determine your fitness and any needed support.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Annual Leave Sickness</h3>
        <p>
          If you fall sick during annual leave, inform your line manager immediately
          and follow sickness procedures. A doctor’s note is required to reclaim leave.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Appointments</h3>
        <p>
          Schedule medical or dental visits outside working hours when possible.
          Full-day absences for appointments count as sick leave.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Pregnancy-related Absence</h3>
        <p>
          These are handled separately in line with Statutory Maternity Pay rules.
        </p>
      </section>

      {/* Sick Pay */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Sick Pay</h2>

        <h3 className="text-xl font-semibold mt-4 mb-1">Statutory Sick Pay (SSP)</h3>
        <p>
          Eligible employees may receive SSP under Inland Revenue guidelines:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>The first 3 days are unpaid (waiting days)</li>
          <li>SSP is payable for up to 28 weeks</li>
          <li>Linked absences (within 56 days) are treated as continuous</li>
          <li>After SSP ends, other government benefits may apply</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-1">Company Sick Pay</h3>
        <p>
          If applicable, company sick pay may be paid in addition to or in place of SSP.
          Any SSP received will be deducted from the total pay.
        </p>
      </section>

      {/* Time Off */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Time Off</h2>

        <h3 className="text-xl font-semibold mt-4 mb-1">Special Leave</h3>
        <p>
          Compassionate leave may be granted for bereavement or emergencies involving
          close relatives or dependants. Requests must be made with as much notice
          as possible. Unpaid leave is discouraged except in special circumstances.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Antenatal Care</h3>
        <p>
          Pregnant employees are entitled to paid time off for antenatal appointments,
          including relaxation and parenting classes (upon doctor/midwife recommendation).
        </p>
        <p className="mt-2">
          Provide your line manager with confirmation of pregnancy and appointment documentation.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Maternity, Paternity & Adoption</h3>
        <p>
          Qualifying employees are entitled to statutory leave and pay for maternity,
          paternity, and adoption. Requests must follow official procedures.
          More details: <a href="https://www.gov.uk" className="text-blue-600 underline" target="_blank">www.gov.uk</a>
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Family Emergency</h3>
        <p>
          Reasonable unpaid time off is allowed for emergencies involving dependants —
          e.g., illness, injury, breakdown in care arrangements, or funerals.
        </p>
      </section>

      {/* Parental Leave */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Parental Leave</h2>
        <p>
          Employees with one year of service may take 13 weeks of unpaid leave per child
          (or 18 weeks for disabled children). This can be taken until:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>The child turns 5 (or 18 if disabled)</li>
          <li>5 years after adoption</li>
        </ul>

        <h3 className="text-xl font-semibold mt-4 mb-1">Procedure</h3>
        <ul className="list-disc list-inside mt-2">
          <li>Leave must be taken in blocks of full weeks (except for disabled children)</li>
          <li>No more than 4 weeks may be taken per year per child</li>
          <li>21 days' written notice is required using the Holiday Request Form</li>
          <li>
            Leave will not be postponed when tied to birth or adoption.
            Otherwise, leave may be postponed for up to 6 months if necessary
          </li>
        </ul>
      </section>

      {/* Flexible Working */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Flexible Working</h2>
        <p>
          Parents of children under 6 (or disabled children under 18), and carers of adults,
          may request flexible working. This includes adjustments to hours, times, or location.
        </p>
        <p className="mt-2">
          See the company’s Flexible Working Policy for details on how to submit a request.
        </p>
      </section>


      {/* Time Off for Public Duties */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Time Off for Public Duties</h2>
        <p>
          If you hold a public position (e.g., school governor, magistrate), you may take reasonable paid
          time off to perform these duties. Approval depends on previous time off taken and business needs.
        </p>
      </section>

      {/* Trade Union Membership */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Trade Union Membership and Duties</h2>
        <p>
          All employees are free to join an appropriate trade union. Reasonable paid time off will be granted
          for union duties related to industrial relations within RFR Professionals.
        </p>
      </section>

      {/* Supervision & Appraisal */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Supervision and Appraisal</h2>
        <p>
          Employees will participate in regular supervision and annual appraisal meetings. These support
          development and performance. It’s your responsibility to arrange the meetings and submit preparation
          forms in advance.
        </p>
        <p className="mt-2">
          Records are retained in your personnel file for one year after resignation.
        </p>
      </section>

      {/* Training & Development */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Training, Development and Promotion</h2>
        <p>
          RFR is committed to employee development. Training needs are discussed with your line manager
          and reviewed regularly. Promotion is based on capability and training outcomes.
        </p>
      </section>

      {/* Communications */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Communications</h2>
        <p>
          Your line manager is your primary source for company updates, support, and feedback.
          Regular staff and team meetings also serve as forums for communication.
        </p>
      </section>

      {/* Performance and Behaviour at Work */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Performance and Behaviour at Work</h2>

        <h3 className="text-xl font-semibold mt-4 mb-1">Appearance</h3>
        <p>
          Dress appropriately for your role and maintain good hygiene. Ask your line manager
          if you're unsure what's acceptable.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Company Premises</h3>
        <p>
          Don’t bring unauthorized persons into RFR property unless approved. Monitor visitors
          at all times. Do not remove RFR property without permission.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Personal Property</h3>
        <p>
          You are responsible for any personal items brought to the workplace. RFR is not liable
          for loss or damage to personal belongings.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Telephones & Correspondence</h3>
        <p>
          Don’t use company phones or mail services for personal reasons without permission. Misuse may result in disciplinary action.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Use of Computers</h3>
        <p>
          All employees must follow RFR's IT, Internet, and Email policy. Personal use of
          internet/email is only allowed during unpaid breaks.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Data Protection and Confidentiality</h3>
        <p>
          Follow all Data Protection Act requirements. Never disclose confidential information
          during or after your employment unless explicitly authorized.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Smoking</h3>
        <p>
          RFR enforces a strict no-smoking policy. Violations will result in disciplinary action.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Alcohol and Drug Abuse</h3>
        <p>
          No alcohol or drugs are permitted on RFR premises. Working under the influence
          will lead to disciplinary procedures and possibly dismissal.
        </p>
      </section>


      {/* Professional Conduct & Public Statements */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Professional Conduct and Public Statements</h2>
        <p>
          Employees must always act in good faith and represent the company positively. No one is allowed
          to speak to the media or publish content related to RFR without prior consent from
          <strong> Olapeju Ojemuyiwa</strong>.
        </p>
      </section>

      {/* Outside Activities & Conflict of Interest */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Outside Activities & Conflict of Interest</h2>
        <p>
          Activities that interfere with your responsibilities at RFR or create a conflict of interest
          must be reported. This includes:
        </p>
        <ul className="list-disc list-inside mt-2">
          <li>Running a business that competes with or serves RFR</li>
          <li>Diverting work time toward another job or venture</li>
          <li>Damaging RFR’s reputation through outside interests</li>
        </ul>
        <p className="mt-2">
          Always disclose potential conflicts to your manager or HR.
        </p>
      </section>

      {/* Bribery and Corruption */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Bribery and Other Corrupt Behaviour</h2>
        <p>
          Bribery — giving or receiving a benefit to influence decisions — is strictly prohibited.
          This includes cash, gifts, favors, or services.
        </p>
        <p className="mt-2">
          Any employee found guilty of bribery will be considered to have committed
          <strong> gross misconduct</strong> and may be dismissed.
        </p>
      </section>

      {/* Mobile Phones, Laptop & IT Security */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Mobile Phones and Devices</h2>
        <p>
          Personal mobile phones should be silenced during work hours. Use is restricted to emergencies.
          The office line may be shared for urgent contact.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Laptop and Company Phone</h3>
        <p>
          Company laptops and phones must be secured using two-factor authentication and encrypted storage
          (e.g., with VeraCrypt). Loss or security failure will result in disciplinary action.
        </p>
      </section>

      {/* Expenses Policy */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Expenses Policy</h2>
        <p>
          No staff member should gain or lose money because of work expenses. The policy outlines reimbursable
          costs and acceptable limits. Claims must be accurate and fair.
        </p>
      </section>

      {/* Disciplinary Procedure */}
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-2">Disciplinary Procedure</h2>
        <p>
          The procedure ensures fair handling of misconduct or poor performance. Employees are entitled to
          hearings, warnings, and appeals at each stage.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Written Warning</h3>
        <p>
          May be issued immediately for serious issues or if prior warnings were ignored.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Final Written Warning</h3>
        <p>
          Given for repeat or serious offenses. States that further issues may result in dismissal.
        </p>

        <h3 className="text-xl font-semibold mt-4 mb-1">Dismissal</h3>
        <p>
          If no improvement follows prior warnings, you may be dismissed. You’ll be given written notice
          or pay in lieu. You may appeal.
        </p>
      </section>

      </div>
    </div>
  </main>

  <footer className="mt-auto">
    <Footer />
  </footer>
</div>


  )


}

export default EmployeeHandbook;