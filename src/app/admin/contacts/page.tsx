'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Eye, 
  EyeOff, 
  Trash2, 
  Mail, 
  Phone, 
  Calendar,
  User,
  MessageSquare,
  Filter,
  Search,
  Download,
  RefreshCw
} from 'lucide-react';
import { format } from 'date-fns';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export default function AdminContactsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'read' | 'unread'>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    unread: 0,
    thisMonth: 0
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/admin/login');
    }
  }, [status, router]);

  useEffect(() => {
    if (session) {
      fetchContacts();
      fetchStats();
    }
  }, [session, filter]);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const queryParams = new URLSearchParams();
      if (filter !== 'all') {
        queryParams.append('read', filter === 'read' ? 'true' : 'false');
      }
      
      const response = await fetch(`/api/contact?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setContacts(data.data || []);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/contact/stats');
      const data = await response.json();
      
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const toggleReadStatus = async (contactId: string, currentStatus: boolean) => {
    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ read: !currentStatus }),
      });

      if (response.ok) {
        setContacts(contacts.map(contact => 
          contact.id === contactId 
            ? { ...contact, read: !currentStatus }
            : contact
        ));
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  const deleteContact = async (contactId: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) {
      return;
    }

    try {
      const response = await fetch(`/api/contact/${contactId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setContacts(contacts.filter(contact => contact.id !== contactId));
        setSelectedContact(null);
        fetchStats(); // Refresh stats
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (contact.subject && contact.subject.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesSearch;
  });

  if (status === 'loading' || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center gap-2">
            <RefreshCw className="w-6 h-6 animate-spin" />
            <span>Loading contacts...</span>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="bg-white shadow rounded-lg p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-2">Contact Messages</h1>
              <p className="text-gray-600">Manage and respond to contact form submissions</p>
            </div>
            <Button
              onClick={() => fetchContacts()}
              variant="outline"
              className="gap-2"
            >
              <RefreshCw className="w-4 h-4" />
              Refresh
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Messages</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <Mail className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Unread</p>
                <p className="text-2xl font-bold text-gray-900">{stats.unread}</p>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">This Month</p>
                <p className="text-2xl font-bold text-gray-900">{stats.thisMonth}</p>
              </div>
            </div>
          </Card>
        </div>

        {/* Filters and Search */}
        <Card className="p-6">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="flex gap-2">
              <Button
                onClick={() => setFilter('all')}
                variant={filter === 'all' ? 'primary' : 'outline'}
                size="sm"
              >
                All
              </Button>
              <Button
                onClick={() => setFilter('unread')}
                variant={filter === 'unread' ? 'primary' : 'outline'}
                size="sm"
              >
                Unread ({stats.unread})
              </Button>
              <Button
                onClick={() => setFilter('read')}
                variant={filter === 'read' ? 'primary' : 'outline'}
                size="sm"
              >
                Read
              </Button>
            </div>

            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
        </Card>

        {/* Contacts List */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Contact List */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Messages ({filteredContacts.length})</h2>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {filteredContacts.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <MessageSquare className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                  <p>No contacts found</p>
                </div>
              ) : (
                filteredContacts.map((contact) => (
                  <div
                    key={contact.id}
                    onClick={() => setSelectedContact(contact)}
                    className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                      selectedContact?.id === contact.id
                        ? 'border-blue-500 bg-blue-50'
                        : 'border-gray-200 hover:border-gray-300'
                    } ${
                      !contact.read ? 'bg-blue-50 border-blue-200' : ''
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-medium text-gray-900">{contact.name}</h3>
                          {!contact.read && (
                            <Badge variant="warning" className="text-xs">New</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{contact.email}</p>
                        <p className="text-sm text-gray-500 mt-1">
                          {contact.subject || 'No subject'}
                        </p>
                        <p className="text-xs text-gray-400 mt-2">
                          {format(new Date(contact.createdAt), 'MMM dd, yyyy HH:mm')}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </Card>

          {/* Contact Detail */}
          <Card className="p-6">
            <h2 className="text-lg font-semibold mb-4">Message Details</h2>
            {selectedContact ? (
              <div className="space-y-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="text-lg font-medium text-gray-900">{selectedContact.name}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Mail className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{selectedContact.email}</span>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Calendar className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        {format(new Date(selectedContact.createdAt), 'MMM dd, yyyy HH:mm')}
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => toggleReadStatus(selectedContact.id, selectedContact.read)}
                      variant="outline"
                      size="sm"
                      className="gap-2"
                    >
                      {selectedContact.read ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      {selectedContact.read ? 'Mark Unread' : 'Mark Read'}
                    </Button>
                    <Button
                      onClick={() => deleteContact(selectedContact.id)}
                      variant="outline"
                      size="sm"
                      className="gap-2 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      Delete
                    </Button>
                  </div>
                </div>

                {selectedContact.subject && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">Subject</h4>
                    <p className="text-gray-700">{selectedContact.subject}</p>
                  </div>
                )}

                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Message</h4>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-gray-700 whitespace-pre-wrap">{selectedContact.message}</p>
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button
                    onClick={() => window.open(`mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Your inquiry'}`)}
                    className="gap-2"
                  >
                    <Mail className="w-4 h-4" />
                    Reply via Email
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>Select a contact to view details</p>
              </div>
            )}
          </Card>
        </div>
      </div>
    </AdminLayout>
  );
}