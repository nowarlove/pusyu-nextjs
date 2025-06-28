"use client";

import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/admin/AdminLayout';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Mail, 
  MailOpen, 
  Trash2, 
  Eye, 
  Search, 
  Filter,
  Calendar,
  User,
  MessageSquare
} from 'lucide-react';

interface Contact {
  id: string;
  name: string;
  email: string;
  subject?: string;
  message: string;
  read: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function AdminContactsPage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all'); // all, unread, read
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Fetch contacts
  const fetchContacts = async () => {
    try {
      const unreadParam = filterStatus === 'unread' ? '?unread=true' : '';
      const response = await fetch(`/api/contact${unreadParam}`);
      if (response.ok) {
        const data = await response.json();
        setContacts(data.contacts);
      }
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [filterStatus]);

  // Mark as read/unread
  const toggleReadStatus = async (contact: Contact) => {
    try {
      const response = await fetch(`/api/contact/${contact.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ read: !contact.read })
      });

      if (response.ok) {
        await fetchContacts();
      }
    } catch (error) {
      console.error('Error updating contact:', error);
    }
  };

  // Delete contact
  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this contact?')) return;

    try {
      const response = await fetch(`/api/contact/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await fetchContacts();
      } else {
        alert('Error deleting contact');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      alert('Error deleting contact');
    }
  };

  // View contact details
  const viewContact = (contact: Contact) => {
    setSelectedContact(contact);
    setIsModalOpen(true);
    
    // Mark as read when viewed
    if (!contact.read) {
      toggleReadStatus(contact);
    }
  };

  // Filter contacts
  const filteredContacts = contacts.filter(contact => {
    const matchesSearch = 
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (contact.subject?.toLowerCase().includes(searchTerm.toLowerCase())) ||
      contact.message.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = 
      filterStatus === 'all' || 
      (filterStatus === 'unread' && !contact.read) ||
      (filterStatus === 'read' && contact.read);

    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const unreadCount = contacts.filter(c => !c.read).length;

  if (loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-lg">Loading contacts...</div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Contact Messages</h1>
            <p className="text-gray-600">
              Manage incoming contact form submissions
              {unreadCount > 0 && (
                <Badge variant="warning" className="ml-2">
                  {unreadCount} unread
                </Badge>
              )}
            </p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-4 justify-between">
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search contacts..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64"
              />
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Messages</option>
              <option value="unread">Unread</option>
              <option value="read">Read</option>
            </select>
          </div>

          <div className="text-sm text-gray-600">
            Total: {filteredContacts.length} messages
          </div>
        </div>

        {/* Contacts List */}
        <div className="grid grid-cols-1 gap-4">
          {filteredContacts.map((contact) => (
            <Card 
              key={contact.id} 
              className={`p-6 transition-all hover:shadow-md ${
                !contact.read ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="flex items-center gap-2">
                      {contact.read ? (
                        <MailOpen className="w-4 h-4 text-gray-400" />
                      ) : (
                        <Mail className="w-4 h-4 text-blue-600" />
                      )}
                      <h3 className="font-semibold text-lg">
                        {contact.name}
                      </h3>
                    </div>
                    {!contact.read && (
                      <Badge variant="primary">New</Badge>
                    )}
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User className="w-4 h-4" />
                      <span>{contact.email}</span>
                    </div>
                    {contact.subject && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MessageSquare className="w-4 h-4" />
                        <span className="font-medium">{contact.subject}</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(contact.createdAt)}</span>
                    </div>
                  </div>

                  <p className="text-gray-700 line-clamp-2 mb-4">
                    {contact.message}
                  </p>
                </div>

                <div className="flex gap-2 ml-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => viewContact(contact)}
                    className="gap-1"
                  >
                    <Eye size={14} />
                    View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => toggleReadStatus(contact)}
                    className="gap-1"
                  >
                    {contact.read ? <Mail size={14} /> : <MailOpen size={14} />}
                    {contact.read ? 'Mark Unread' : 'Mark Read'}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-600 hover:bg-red-50 gap-1"
                  >
                    <Trash2 size={14} />
                    Delete
                  </Button>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {filteredContacts.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Mail size={48} className="mx-auto" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">No messages found</h3>
            <p className="text-gray-600">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter' 
                : 'No contact messages received yet'
              }
            </p>
          </div>
        )}

        {/* Contact Detail Modal */}
        {isModalOpen && selectedContact && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
              <div className="p-6">
                <div className="flex justify-between items-start mb-6">
                  <h2 className="text-2xl font-bold">Contact Details</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setIsModalOpen(false)}
                  >
                    Close
                  </Button>
                </div>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name
                    </label>
                    <p className="text-gray-900">{selectedContact.name}</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <p className="text-gray-900">
                      <a 
                        href={`mailto:${selectedContact.email}`}
                        className="text-blue-600 hover:underline"
                      >
                        {selectedContact.email}
                      </a>
                    </p>
                  </div>

                  {selectedContact.subject && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Subject
                      </label>
                      <p className="text-gray-900">{selectedContact.subject}</p>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Message
                    </label>
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <p className="text-gray-900 whitespace-pre-wrap">
                        {selectedContact.message}
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Received
                    </label>
                    <p className="text-gray-900">{formatDate(selectedContact.createdAt)}</p>
                  </div>

                  <div className="flex gap-2 pt-4">
                    <Button
                      onClick={() => window.location.href = `mailto:${selectedContact.email}?subject=Re: ${selectedContact.subject || 'Your inquiry'}`}
                      className="flex-1"
                    >
                      Reply via Email
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => toggleReadStatus(selectedContact)}
                      className="flex-1"
                    >
                      {selectedContact.read ? 'Mark as Unread' : 'Mark as Read'}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}