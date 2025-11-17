import { useEffect, useState } from "react";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase/firebaseConfig";
import { Loader, AlertCircle, Users, Search, Grid, List } from "lucide-react";

export default function AdminStudents() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState("grid");

  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const q = query(collection(db, "users"), where("role", "==", "student"));
        const snap = await getDocs(q);
        const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
        setStudents(list);
        setFilteredStudents(list);
      } catch (err) {
        console.error("❌ Error fetching students:", err);
        setError("Failed to load student data");
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const filtered = students.filter(
      (student) =>
        student.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.regNo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.department?.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredStudents(filtered);
  }, [searchTerm, students]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-slate-50">
        <div className="text-center">
          <div className="relative">
            <div className="w-20 h-20 border-4 border-green-200 rounded-full"></div>
            <div className="w-20 h-20 border-4 border-green-700 rounded-full border-t-transparent animate-spin absolute top-0 left-0"></div>
          </div>
          <p className="text-slate-600 font-medium mt-4">Loading payments...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 p-8">
        <div className="max-w-2xl mx-auto">
          <div className="flex items-start bg-white border border-red-200 p-6 rounded-2xl shadow-sm">
            <div className="bg-red-100 p-2 rounded-lg mr-4">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="font-semibold text-slate-900 text-lg">Error Loading Data</h3>
              <p className="text-slate-600 mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-2">
              NACOSITES            </h1>
            <p className="text-slate-600">
              we have {students.length} registered student{students.length !== 1 ? "s" : ""}
            </p>
          </div>
          
          {/* View Toggle */}
          <div className="flex gap-2 mt-4 md:mt-0 bg-white p-1.5 rounded-xl shadow-sm border border-slate-200">
            <button
              onClick={() => setViewMode("grid")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "grid"
                  ? "bg-green-700 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <Grid className="w-4 h-4 inline mr-2" />
              Grid
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`px-4 py-2 rounded-lg font-medium transition-all ${
                viewMode === "list"
                  ? "bg-green-700 text-white shadow-sm"
                  : "text-slate-600 hover:bg-slate-100"
              }`}
            >
              <List className="w-4 h-4 inline mr-2" />
              List
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="mb-6 relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search students..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3.5 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-green-700 focus:ring-2 focus:ring-green-100 transition-all shadow-sm text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Content */}
        {filteredStudents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm p-16 text-center border border-slate-200">
            <div className="bg-slate-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-10 h-10 text-slate-400" />
            </div>
            <p className="text-slate-600 text-lg font-medium">
              {searchTerm ? "No students found" : "No students registered yet"}
            </p>
            <p className="text-slate-500 text-sm mt-2">
              {searchTerm && "Try adjusting your search terms"}
            </p>
          </div>
        ) : viewMode === "grid" ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredStudents.map((student) => (
              <div
                key={student.id}
                className="bg-white rounded-2xl shadow-sm border border-slate-200 p-6 hover:shadow-md hover:border-green-200 transition-all"
              >
                <div className="flex items-start gap-4 mb-4">
                  <div className="w-14 h-14 bg-gradient-to-br from-green-600 to-green-800 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
                    {student.name?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 text-lg truncate">
                      {student.name || "N/A"}
                    </h3>
                    <p className="text-slate-500 text-sm font-mono">
                      {student.regNo}
                    </p>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-slate-500">Email:</span>
                    <span className="text-slate-700 truncate">{student.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                      {student.department || "No Department"}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-slate-200">
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="bg-slate-100 border-b border-slate-200">
                    <th className="text-left px-6 py-4 text-slate-700 font-semibold text-sm">
                      Student
                    </th>
                    <th className="text-left px-6 py-4 text-slate-700 font-semibold text-sm">
                      Registration No
                    </th>
                    <th className="text-left px-6 py-4 text-slate-700 font-semibold text-sm">
                      Department
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredStudents.map((student) => (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-br from-green-600 to-green-800 rounded-lg flex items-center justify-center text-white font-semibold shadow-sm">
                            {student.name?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                          <span className="font-medium text-slate-900">
                            {student.name || "N/A"}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-slate-700 font-mono text-sm">
                        {student.regNo}
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex px-3 py-1 bg-green-50 text-green-700 rounded-lg text-sm font-medium">
                          {student.department || "—"}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        {filteredStudents.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Showing <span className="font-semibold text-slate-700">{filteredStudents.length}</span> of{" "}
              <span className="font-semibold text-slate-700">{students.length}</span> students
            </p>
          </div>
        )}
      </div>
    </div>
  );
}