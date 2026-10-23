// import { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';
// import { GetMyResumes, UploadMasterResume } from '../../services/resume.api'; // Tera api file path
// import { logout } from '../../services/auth.api';
// const Dashboard = () => {
//   const [resumes, setResumes] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const navigate = useNavigate();

//   // File upload ke liye states
//   const [file, setFile] = useState(null);
//   const [uploading, setUploading] = useState(false);

//   // Page load hote hi resumes fetch karenge
//   const fetchResumes = async () => {
//     try {
//       const response = await GetMyResumes();
//       if (response && response.data) {
//         setResumes(response.data);
//       }
//     } catch (error) {
//       console.error('Error fetching resumes:', error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     // Linter ko shant karne ke liye ek dummy async function me wrap kar diya
//     const loadData = async () => {
//       await fetchResumes();
//     };

//     loadData();
//   }, []);

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!file) {
//       alert('Bhai pehle PDF file toh select kar!');
//       return;
//     }

//     setUploading(true);
//     try {
//       await UploadMasterResume(file);
//       alert('Master Resume Upload aur Parse ho gaya mast ekdum!');
//       setFile(null); // File input clear kar do
//       fetchResumes(); // Naya resume list me dikhane ke liye API wapas call
//     } catch (error) {
//       console.error(error);
//       alert('Upload me error aagaya bhai.');
//     } finally {
//       setUploading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <main className="min-h-screen flex items-center justify-center bg-gray-50">
//         <h1 className="text-2xl font-semibold text-gray-600 animate-pulse">
//           Loading Dashboard...
//         </h1>
//       </main>
//     );
//   }

//   // Ye function selected file ko state me save karta hai
//   const handleFileChange = (e) => {
//     setFile(e.target.files[0]);
//   };

//   const handleLogout = async () => {
//     try {
//       await logout();
//       navigate('/login', { replace: true });
//     } catch (error) {
//       console.error('Logout me error aaya:', error);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
//       <div className="max-w-4xl mx-auto">
//         <div
//           style={{
//             display: 'flex',
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '30px',
//           }}
//         >
//           <h1 style={{ margin: 0 }}>Welcome to RoleReady Dashboard</h1>
//           <button
//             onClick={handleLogout}
//             style={{
//               background: '#dc3545',
//               color: 'white',
//               border: 'none',
//               padding: '10px 20px',
//               borderRadius: '8px',
//               cursor: 'pointer',
//               fontWeight: 'bold',
//             }}
//           >
//             Logout 🚪
//           </button>
//         </div>

//         {/* 1. MASTER RESUME UPLOAD SECTION */}
//         <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 mb-10 transition-all hover:shadow-md">
//           <h2 className="text-xl font-bold text-gray-800 mb-6">
//             Upload Master Resume
//           </h2>
//           <form className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
//             <div className="w-full flex-grow">
//               <input
//                 type="file"
//                 accept=".pdf"
//                 onChange={handleFileChange}
//                 required
//                 className="block w-full text-sm text-gray-600
//                   file:mr-4 file:py-2.5 file:px-5
//                   file:rounded-lg file:border-0
//                   file:text-sm file:font-semibold
//                   file:bg-indigo-50 file:text-indigo-700
//                   hover:file:bg-indigo-100 cursor-pointer
//                   border border-gray-200 rounded-lg p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
//               />
//             </div>
//             <button
//               className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
//               onClick={handleUpload}
//               disabled={uploading}
//             >
//               {uploading ? 'Uploading & Parsing...' : 'Upload Resume'}
//             </button>
//           </form>
//         </section>

//         {/* 2. SAVED RESUMES LIST SECTION */}
//         <section>
//           <h2 className="text-2xl font-bold text-gray-900 mb-6">My Resumes</h2>
//           {resumes.length === 0 ? (
//             <div className="bg-amber-50 text-amber-800 p-5 rounded-xl border border-amber-200 shadow-sm">
//               <p className="font-medium text-amber-900">
//                 Koi resume nahi mila. Pehle apna Master Resume upload kar upar
//                 se!
//               </p>
//             </div>
//           ) : (
//             <div className="flex flex-col gap-4">
//               {resumes.map((res) => (
//                 <div
//                   key={res._id}
//                   onClick={() =>
//                     navigate('/resume-view', { state: { id: res._id } })
//                   }
//                   className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4"
//                 >
//                   <div>
//                     <h3 className="text-lg font-bold text-gray-800 mb-1 flex items-center gap-2">
//                       {res.isMaster ? '👑 Master Resume' : '📝 Tailored Resume'}
//                     </h3>
//                     {res.targetRole && (
//                       <p className="text-sm text-gray-600 mb-2">
//                         <span className="font-semibold text-gray-900">
//                           Role:
//                         </span>{' '}
//                         {res.targetRole}
//                       </p>
//                     )}
//                     <p className="text-xs text-gray-400 font-mono bg-gray-100 inline-block px-2 py-1 rounded">
//                       ID: {res._id}
//                     </p>
//                   </div>

//                   {/* Aage chal kar yahan 'Tailor for New Job' ka button lagayenge */}
//                   <div className="mt-2 sm:mt-0">
//                     <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800 border border-gray-200">
//                       {res.isMaster ? 'Master File' : 'Tailored File'}
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           )}
//         </section>
//       </div>
//     </main>
//   );
// };

// export default Dashboard;


import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { GetMyResumes, UploadMasterResume, TailorResume } from '../../services/resume.api';
import { logout } from '../../services/auth.api';

const Dashboard = () => {
  const [masterResume, setMasterResume] = useState(null);
  const [tailoredResumes, setTailoredResumes] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const [jobDescription, setJobDescription] = useState('');
  const [tailoring, setTailoring] = useState(false);

  const fetchResumes = async () => {
    try {
      const response = await GetMyResumes();
      if (response && response.data) {
        const master = response.data.find((res) => res.isMaster);
        const tailored = response.data.filter((res) => !res.isMaster);
        
        setMasterResume(master || null);
        setTailoredResumes(tailored);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      await fetchResumes();
    };
    loadData();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert('Please select a PDF file first!');
      return;
    }

    setUploading(true);
    try {
      await UploadMasterResume(file);
      alert('Master Resume uploaded and parsed successfully!');
      setFile(null);
      fetchResumes();
    } catch (error) {
      console.error(error);
      alert('Upload failed.');
    } finally {
      setUploading(false);
    }
  };

  const handleTailor = async () => {
    if (!jobDescription.trim()) {
      alert('Please paste a Job Description first!');
      return;
    }
    if (!masterResume) {
      alert('You need a Master Resume first!');
      return;
    }

    setTailoring(true);
    try {
      await TailorResume(masterResume._id, jobDescription);
      alert('Tailored resume generated successfully!');
      setJobDescription('');
      fetchResumes();
    } catch (error) {
      console.error(error);
      alert('Failed to tailor resume.');
    } finally {
      setTailoring(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/login', { replace: true });
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <h1 className="text-2xl font-semibold text-gray-600 animate-pulse">
          Loading Dashboard...
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50 py-10 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="max-w-4xl mx-auto">
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '30px',
          }}
        >
          <h1 style={{ margin: 0, fontSize: '24px', fontWeight: 'bold' }}>Dashboard</h1>
          <button
            onClick={handleLogout}
            style={{
              background: '#dc3545',
              color: 'white',
              border: 'none',
              padding: '10px 20px',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
            }}
          >
            Logout
          </button>
        </div>

        <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-6">
            1. Master Resume
          </h2>
          
          {masterResume ? (
            <div className="bg-indigo-50 border border-indigo-100 p-5 rounded-xl flex justify-between items-center">
              <div>
                <h3 className="font-bold text-indigo-900 text-lg flex items-center gap-2">
                  👑 Active Master Resume
                </h3>
                <p className="text-sm text-indigo-700 mt-1">ID: {masterResume._id}</p>
              </div>
              <button
                onClick={() => navigate('/resume-view', { state: { id: masterResume._id } })}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700"
              >
                View Data
              </button>
            </div>
          ) : (
            <form className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="w-full flex-grow">
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  required
                  className="block w-full text-sm text-gray-600
                    file:mr-4 file:py-2.5 file:px-5
                    file:rounded-lg file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100 cursor-pointer
                    border border-gray-200 rounded-lg p-2 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                />
              </div>
              <button
                className="w-full sm:w-auto px-6 py-3 bg-indigo-600 text-white font-medium rounded-lg hover:bg-indigo-700 focus:ring-4 focus:ring-indigo-200 transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-sm"
                onClick={handleUpload}
                disabled={uploading}
              >
                {uploading ? 'Parsing...' : 'Upload & Parse'}
              </button>
            </form>
          )}
        </section>

        {masterResume && (
          <section className="bg-white p-6 sm:p-8 rounded-2xl shadow-sm border border-gray-200 mb-8">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              2. Tailor for New Job
            </h2>
            <textarea
              rows="4"
              className="w-full p-4 border border-gray-300 rounded-xl mb-4 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Paste the Job Description (JD) here..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <button
              onClick={handleTailor}
              disabled={tailoring}
              className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-all disabled:opacity-60"
            >
              {tailoring ? 'AI is Tailoring... ⏳' : '✨ Generate Tailored Resume'}
            </button>
          </section>
        )}

        {masterResume && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">3. Tailored Versions</h2>
            {tailoredResumes.length === 0 ? (
              <div className="bg-gray-50 text-gray-500 p-5 rounded-xl border border-gray-200 text-center">
                No tailored resumes yet. Paste a JD above to create one.
              </div>
            ) : (
              <div className="flex flex-col gap-4">
                {tailoredResumes.map((res) => (
                  <div
                    key={res._id}
                    onClick={() => navigate('/resume-view', { state: { id: res._id } })}
                    className="bg-white p-5 rounded-xl shadow-sm border border-gray-200 hover:shadow-md hover:border-indigo-300 transition-all cursor-pointer flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">
                        {res.targetRole ? `Role: ${res.targetRole}` : 'Tailored Resume'}
                      </h3>
                      <p className="text-xs text-gray-400 mt-1">ID: {res._id}</p>
                    </div>
                    <span className="text-indigo-600 font-medium text-sm">
                      View →
                    </span>
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
};

export default Dashboard;