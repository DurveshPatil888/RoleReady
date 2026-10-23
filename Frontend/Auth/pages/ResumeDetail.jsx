

// import { useState, useEffect } from 'react';
// import { useNavigate, useLocation } from 'react-router-dom';
// import { GetResumeById, TailorResume } from '../../services/resume.api';

// const ResumeDetail = () => {
//   const navigate = useNavigate();
//   const location = useLocation();
//   const [showJDForm, setShowJDForm] = useState(false);
//   const [jobDesc, setJobDesc] = useState('');
//   const [tailoring, setTailoring] = useState(false);
//   const [resume, setResume] = useState(null);
//   const [loading, setLoading] = useState(true);

//   const id = location.state?.id;

//   useEffect(() => {
//     if (!id) {
//       navigate('/dashboard');
//     }
//   }, [id, navigate]);

//   const handleTailorSubmit = async () => {
//     if (!jobDesc.trim()) {
//       alert('Please paste the Job Description first!');
//       return;
//     }

//     setTailoring(true);
//     try {
//       await TailorResume(resume._id, jobDesc);
//       alert('Tailored Resume generated successfully!');
//       navigate('/dashboard');
//     } catch (error) {
//       console.error(error);
//       alert('Error occurred while tailoring the resume.');
//     } finally {
//       setTailoring(false);
//     }
//   };

//   useEffect(() => {
//     const fetchResume = async () => {
//       try {
//         const data = await GetResumeById(id);
//         if (data) {
//           setResume(data);
//         }
//       } catch (error) {
//         console.error(error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (id) {
//       fetchResume();
//     }
//   }, [id]);

//   if (loading) {
//     return (
//       <main style={{ padding: '20px', textAlign: 'center' }}>
//         <h2>Loading...</h2>
//       </main>
//     );
//   }

//   if (!resume) {
//     return (
//       <main style={{ padding: '20px', textAlign: 'center' }}>
//         <h2>Resume not found!</h2>
//         <button className="button" onClick={() => navigate('/dashboard')}>
//           Back to Dashboard
//         </button>
//       </main>
//     );
//   }

//   const allSkills = resume.skills ? Object.values(resume.skills).flat() : [];

//   return (
//     <main style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
//       <div
//         style={{
//           display: 'flex',
//           justifyContent: 'space-between',
//           alignItems: 'center',
//           marginBottom: '20px',
//         }}
//       >
//         <button className="button" onClick={() => navigate('/dashboard')}>
//           Back to Dashboard
//         </button>
//         <button
//           className="button primary-button"
//           onClick={() => setShowJDForm(!showJDForm)}
//         >
//           {showJDForm ? 'Cancel' : 'Tailor for New Job'}
//         </button>
//       </div>

//       {showJDForm && (
//         <div
//           style={{
//             background: '#e3f2fd',
//             padding: '20px',
//             borderRadius: '10px',
//             marginBottom: '20px',
//             border: '1px solid #90caf9',
//           }}
//         >
//           <h3 style={{ margin: '0 0 10px 0', color: '#0d47a1' }}>
//             Paste Job Description
//           </h3>
//           <textarea
//             rows="6"
//             style={{
//               width: '100%',
//               padding: '15px',
//               borderRadius: '8px',
//               border: '1px solid #ccc',
//               fontSize: '14px',
//               marginBottom: '15px',
//               resize: 'vertical',
//             }}
//             placeholder="Paste the full job description here..."
//             value={jobDesc}
//             onChange={(e) => setJobDesc(e.target.value)}
//           />
//           <button
//             className="button primary-button"
//             style={{ width: '100%', background: '#28a745' }}
//             onClick={handleTailorSubmit}
//             disabled={tailoring}
//           >
//             {tailoring
//               ? 'AI is tailoring... Please wait'
//               : 'Generate Tailored Resume'}
//           </button>
//         </div>
//       )}

//       <div
//         style={{
//           background: '#fff',
//           padding: '25px',
//           borderRadius: '10px',
//           boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//         }}
//       >
//         <h1 style={{ margin: '0 0 10px 0' }}>
//           {resume.personalInfo?.fullName || 'Durvesh Patil'}
//         </h1>
//         <p style={{ margin: '0 0 20px 0', color: '#666' }}>
//           {resume.personalInfo?.email} | {resume.personalInfo?.phone}
//         </p>

//         {resume.summary && (
//           <div
//             style={{
//               marginBottom: '20px',
//               background: '#f8f9fa',
//               padding: '15px',
//               borderRadius: '8px',
//             }}
//           >
//             <p style={{ margin: 0, fontSize: '15px', lineHeight: '1.6' }}>
//               {resume.summary}
//             </p>
//           </div>
//         )}

//         <h3 style={{ margin: '0 0 10px 0', color: '#007bff' }}>
//           {resume.isMaster ? 'Master Resume' : 'Tailored Resume'}
//         </h3>
//         {resume.targetRole && (
//           <p style={{ color: '#555', marginTop: 0, fontWeight: 'bold' }}>
//             Target Role: {resume.targetRole}
//           </p>
//         )}

//         <hr
//           style={{
//             margin: '20px 0',
//             border: 'none',
//             borderTop: '1px solid #eee',
//           }}
//         />

//         <section style={{ marginBottom: '30px' }}>
//           <h2
//             style={{
//               borderBottom: '2px solid #007bff',
//               paddingBottom: '5px',
//               display: 'inline-block',
//             }}
//           >
//             Skills
//           </h2>
//           <div
//             style={{
//               display: 'flex',
//               flexWrap: 'wrap',
//               gap: '10px',
//               marginTop: '10px',
//             }}
//           >
//             {allSkills.length > 0 ? (
//               allSkills.map((skill, index) => (
//                 <span
//                   key={index}
//                   style={{
//                     background: '#e3f2fd',
//                     color: '#0d47a1',
//                     padding: '6px 14px',
//                     borderRadius: '20px',
//                     fontSize: '14px',
//                     fontWeight: '500',
//                   }}
//                 >
//                   {skill}
//                 </span>
//               ))
//             ) : (
//               <p>No skills data found.</p>
//             )}
//           </div>
//         </section>

//         <section style={{ marginBottom: '20px' }}>
//           <h2
//             style={{
//               borderBottom: '2px solid #007bff',
//               paddingBottom: '5px',
//               display: 'inline-block',
//             }}
//           >
//             Experience
//           </h2>
//           <div style={{ marginTop: '10px' }}>
//             {resume.experience && resume.experience.length > 0 ? (
//               resume.experience.map((exp, index) => (
//                 <div
//                   key={index}
//                   style={{
//                     marginBottom: '15px',
//                     background: '#f9f9f9',
//                     padding: '15px',
//                     borderRadius: '8px',
//                     borderLeft: '4px solid #007bff',
//                   }}
//                 >
//                   <h3 style={{ margin: '0 0 5px 0' }}>
//                     {exp.title} @ {exp.company}
//                   </h3>
//                   <p
//                     style={{
//                       margin: '0',
//                       fontSize: '13px',
//                       color: '#666',
//                       fontWeight: 'bold',
//                     }}
//                   >
//                     {exp.startDate} - {exp.endDate}
//                   </p>
//                   <p
//                     style={{
//                       marginTop: '10px',
//                       fontSize: '15px',
//                       lineHeight: '1.5',
//                     }}
//                   >
//                     {exp.description || 'No description available.'}
//                   </p>
//                 </div>
//               ))
//             ) : (
//               <p>No experience data found.</p>
//             )}
//           </div>
//         </section>
//       </div>
//     </main>
//   );
// };

// export default ResumeDetail;

import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { GetResumeById, DownloadResumePdf } from '../../services/resume.api';

const ResumeDetail = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [resume, setResume] = useState(null);
  const [loading, setLoading] = useState(true);
  const [downloading, setDownloading] = useState(false);

  const id = location.state?.id;

  useEffect(() => {
    if (!id) {
      navigate('/dashboard');
    }
  }, [id, navigate]);

const handleDownloadPDF = async () => {
    setDownloading(true);
    try {
      const blob = await DownloadResumePdf(resume._id);
      
      // Blob (binary data) ko temporary URL me convert karna
      const url = window.URL.createObjectURL(new Blob([blob]));
      const link = document.createElement('a');
      link.href = url;
      
      // File ka naam dynamically set karna
      const fileName = `${resume.personalInfo?.fullName || 'RoleReady'}_Resume.pdf`.replace(/\s+/g, '_');
      link.setAttribute('download', fileName);
      
      // Hidden link body me daal ke usko click karwana
      document.body.appendChild(link);
      link.click();
      
      // Download hone ke baad link ko uda dena
      link.parentNode.removeChild(link);
    } catch (error) {
      console.error(error);
      alert('PDF Download fail ho gaya bhai.');
    } finally {
      setDownloading(false);
    }
  };

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const data = await GetResumeById(id);
        if (data) {
          setResume(data);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchResume();
    }
  }, [id]);

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-semibold text-gray-600 animate-pulse">
          Loading Resume Details...
        </h2>
      </main>
    );
  }

  if (!resume) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Resume not found!</h2>
        <button
          className="px-6 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          onClick={() => navigate('/dashboard')}
        >
          Back to Dashboard
        </button>
      </main>
    );
  }

  const allSkills = resume.skills ? Object.values(resume.skills).flat() : [];

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        {/* TOP NAVIGATION BAR */}
        <div className="flex justify-between items-center mb-6">
          <button
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium shadow-sm"
            onClick={() => navigate('/dashboard')}
          >
            ← Back to Dashboard
          </button>
          
         <button
            className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium shadow-sm flex items-center gap-2 disabled:opacity-50"
            onClick={handleDownloadPDF}
            disabled={downloading}
          >
            {downloading ? 'Downloading... ⏳' : '🖨️ Download PDF'}
          </button>
        </div>
        

        {/* RESUME DOCUMENT CONTAINER */}
        <div className="bg-white p-8 sm:p-12 rounded-2xl shadow-sm border border-gray-200">
          
          {/* HEADER SECTION */}
          <div className="border-b border-gray-200 pb-6 mb-8 text-center sm:text-left">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              {resume.personalInfo?.fullName || 'Durvesh Patil'}
            </h1>
            <p className="text-gray-600 font-medium">
              {resume.personalInfo?.email} | {resume.personalInfo?.phone}
            </p>
            <div className="mt-5 inline-flex items-center px-4 py-1.5 bg-indigo-50 text-indigo-700 rounded-full text-sm font-bold border border-indigo-100">
              {resume.isMaster ? '👑 Master Resume' : '📝 Tailored Resume'}
              {resume.targetRole && (
                <span className="ml-3 border-l-2 border-indigo-200 pl-3">
                  Role: {resume.targetRole}
                </span>
              )}
            </div>
          </div>

          {/* SUMMARY SECTION */}
          {resume.summary && (
            <div className="mb-8">
              <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-600 inline-block pb-1 mb-4">
                Professional Summary
              </h2>
              <p className="text-gray-700 leading-relaxed bg-gray-50 p-5 rounded-xl border border-gray-100">
                {resume.summary}
              </p>
            </div>
          )}

          {/* SKILLS SECTION */}
          <section className="mb-8">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-600 inline-block pb-1 mb-4">
              Skills
            </h2>
            <div className="flex flex-wrap gap-2">
              {allSkills.length > 0 ? (
                allSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="bg-indigo-50 text-indigo-700 px-4 py-1.5 rounded-full text-sm font-medium border border-indigo-100"
                  >
                    {skill}
                  </span>
                ))
              ) : (
                <p className="text-gray-500 italic">No skills data found.</p>
              )}
            </div>
          </section>

          {/* EXPERIENCE SECTION */}
          <section className="mb-4">
            <h2 className="text-xl font-bold text-gray-800 border-b-2 border-indigo-600 inline-block pb-1 mb-5">
              Experience
            </h2>
            <div className="space-y-6">
              {resume.experience && resume.experience.length > 0 ? (
                resume.experience.map((exp, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 p-6 rounded-xl border-l-4 border-indigo-500 shadow-sm transition-all hover:shadow-md"
                  >
                    <h3 className="text-lg font-bold text-gray-900 mb-1">
                      {exp.title} <span className="text-indigo-600">@ {exp.company}</span>
                    </h3>
                    <p className="text-sm font-bold text-gray-500 mb-3">
                      {exp.startDate} — {exp.endDate}
                    </p>
                    <p className="text-gray-700 leading-relaxed text-sm">
                      {exp.description || 'No description available.'}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 italic">No experience data found.</p>
              )}
            </div>
          </section>

        </div>
      </div>
    </main>
  );
};

export default ResumeDetail;