'use client';
import { signOut, useSession } from 'next-auth/react';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { UserIcon, ArrowLeftOnRectangleIcon } from '@heroicons/react/24/outline';

export default function AdminHeader() {
  const { data: session } = useSession();

  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
          </div>
          
          <div className="flex items-center space-x-4">
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-500 hover:text-gray-700 text-sm font-medium"
            >
              View Site →
            </a>
            
            <Menu as="div" className="relative">
              <Menu.Button className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 bg-gray-300 rounded-full flex items-center justify-center">
                    <UserIcon className="h-5 w-5 text-gray-600" />
                  </div>
                  <span className="text-gray-700 font-medium">{session?.user?.name}</span>
                </div>
              </Menu.Button>
              
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={() => signOut({ callbackUrl: '/admin/login' })}
                        className={`${
                          active ? 'bg-gray-100' : ''
                        } flex w-full items-center px-4 py-2 text-sm text-gray-700`}
                      >
                        <ArrowLeftOnRectangleIcon className="mr-3 h-5 w-5" />
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </div>
      </div>
    </div>
  );
}