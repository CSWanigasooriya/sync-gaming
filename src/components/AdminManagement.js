import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

export default function AdminManagement({ userToken, currentUserEmail }) {
  const [activeTab, setActiveTab] = useState('add');
  const [adminEmail, setAdminEmail] = useState('');
  const [admins, setAdmins] = useState([]);
  const [auditLogs, setAuditLogs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Fetch admins list
  const fetchAdmins = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/admin/list-admins`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setAdmins(data.admins);
    } catch (err) {
      setError('Failed to fetch admins: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  // Fetch audit logs
  const fetchAuditLogs = useCallback(async () => {
    try {
      setLoading(true);
      setError('');
      const response = await fetch(`${API_URL}/admin/audit-logs`, {
        headers: {
          'Authorization': `Bearer ${userToken}`
        }
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      setAuditLogs(data.logs);
    } catch (err) {
      setError('Failed to fetch audit logs: ' + err.message);
    } finally {
      setLoading(false);
    }
  }, [userToken]);

  // Add admin
  const handleAddAdmin = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(`${API_URL}/admin/set-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: adminEmail })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to set admin');
      }

      setSuccess('Admin privileges granted successfully!');
      setAdminEmail('');
      setTimeout(() => fetchAdmins(), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Remove admin
  const handleRemoveAdmin = async (email) => {
    if (!window.confirm(`Remove admin privileges from ${email}?`)) return;

    try {
      setLoading(true);
      setError('');
      setSuccess('');

      const response = await fetch(`${API_URL}/admin/remove-admin`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${userToken}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email })
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || 'Failed to remove admin');
      }

      setSuccess('Admin privileges removed successfully!');
      setTimeout(() => fetchAdmins(), 1000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'admins') {
      fetchAdmins();
    } else if (activeTab === 'logs') {
      fetchAuditLogs();
    }
  }, [activeTab, fetchAdmins, fetchAuditLogs]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.3 }}
      className="bg-gray-800/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 overflow-hidden"
    >
      {/* Tab Navigation */}
      <div className="flex border-b border-gray-700">
        {[
          { id: 'add', label: '➕ Add Admin' },
          { id: 'admins', label: '👥 Admin List' },
          { id: 'logs', label: '📋 Audit Logs' }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex-1 py-4 px-6 font-semibold transition-all relative ${
              activeTab === tab.id ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            {tab.label}
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeAdminTab"
                className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-blue-600 to-purple-600"
                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
              />
            )}
          </button>
        ))}
      </div>

      {/* Tab Content */}
      <div className="p-6">
        <AnimatePresence mode="wait">
          {/* Add Admin Tab */}
          {activeTab === 'add' && (
            <motion.div
              key="add"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4">Grant Admin Privileges</h3>

              <AnimatePresence>
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-red-500/10 border border-red-500/50 rounded-lg text-red-400 text-sm"
                  >
                    {error}
                  </motion.div>
                )}
                {success && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="mb-4 p-3 bg-green-500/10 border border-green-500/50 rounded-lg text-green-400 text-sm"
                  >
                    {success}
                  </motion.div>
                )}
              </AnimatePresence>

              <form onSubmit={handleAddAdmin} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">User Email</label>
                  <input
                    type="email"
                    placeholder="user@example.com"
                    className="w-full px-4 py-2 rounded-lg bg-gray-900/50 border border-gray-700 text-white placeholder-gray-500 focus:outline-none focus:border-blue-500"
                    value={adminEmail}
                    onChange={e => setAdminEmail(e.target.value)}
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full py-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition disabled:opacity-50"
                >
                  {loading ? 'Processing...' : 'Grant Admin Access'}
                </motion.button>
              </form>
            </motion.div>
          )}

          {/* Admins List Tab */}
          {activeTab === 'admins' && (
            <motion.div
              key="admins"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4">Current Admins ({admins.length})</h3>

              {loading ? (
                <p className="text-gray-400">Loading admins...</p>
              ) : admins.length === 0 ? (
                <p className="text-gray-400">No admins found</p>
              ) : (
                <div className="space-y-3">
                  {admins.map((admin, idx) => (
                    <motion.div
                      key={admin.uid}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="flex justify-between items-center p-3 bg-gray-900/50 rounded-lg border border-gray-700/50"
                    >
                      <div>
                        <p className="font-medium">{admin.email}</p>
                        <p className="text-xs text-gray-500">{admin.uid}</p>
                      </div>
                      {admin.email !== currentUserEmail && (
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleRemoveAdmin(admin.email)}
                          className="px-3 py-1 rounded bg-red-600 hover:bg-red-700 transition text-sm"
                        >
                          Remove
                        </motion.button>
                      )}
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}

          {/* Audit Logs Tab */}
          {activeTab === 'logs' && (
            <motion.div
              key="logs"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="text-lg font-semibold mb-4">Admin Activity Logs</h3>

              {loading ? (
                <p className="text-gray-400">Loading logs...</p>
              ) : auditLogs.length === 0 ? (
                <p className="text-gray-400">No activity logs</p>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {auditLogs.map((log, idx) => (
                    <motion.div
                      key={log.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.05 }}
                      className="p-3 bg-gray-900/50 rounded-lg border border-gray-700/50 text-sm"
                    >
                      <div className="flex justify-between items-start mb-2">
                        <span className={`font-semibold ${
                          log.action === 'SET_ADMIN' ? 'text-green-400' : 'text-orange-400'
                        }`}>
                          {log.action === 'SET_ADMIN' ? '✓ Granted' : '✕ Removed'}
                        </span>
                        <span className="text-xs text-gray-500">
                          {new Date(log.timestamp).toLocaleString()}
                        </span>
                      </div>
                      <p className="text-gray-400">
                        <strong>{log.performedBy}</strong> {log.action === 'SET_ADMIN' ? 'granted' : 'removed'} admin access for <strong>{log.targetUser}</strong>
                      </p>
                    </motion.div>
                  ))}
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
