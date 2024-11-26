import { useState, useEffect } from "react";
import toast, { Toaster } from 'react-hot-toast';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import axios from 'axios';

export function UserManagement() {
  const [searchTerm, setSearchTerm] = useState("");
  const [users, setUsers] = useState<any[]>([]);
  const [newUser, setNewUser] = useState({ name: "", email: "",password:"", role: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<any[]>([]);

  const cookie = Cookies.get("jwt");
  if(!cookie) {
    console.log('No JWT token found');
  }
  console.log(cookie);

  // Function to fetch all users
  const getAllUsers = async () => {
    try {
      if (!cookie) {
        throw new Error('No JWT token found');
      }

      const response = await axios.get('http://localhost:5454/api/v1/user/getAllUsers', {
        headers: {
          Authorization: `Bearer ${cookie}`,
        },
      });

      // console.log(response.data)
      return response.data.data
    } catch (error) {
      console.log('Error fetching users:', error);
      throw error;
    }
  };

  // Fetch users on component mount
  useEffect(() => {
    async function fetchUsers() {
      try {
        setIsLoading(true);
        const data = await getAllUsers();
        setUsers(data);
        setFilteredUsers(data); // Initialize filteredUsers with all users
        setIsLoading(false);
        

        console.log(data)
        toast.success('Users fetched')
      } catch (err) {
        setError("Failed to fetch users.");
        setIsLoading(false);
        toast.error('User not fetched')
      }
    }

    fetchUsers();
  }, []);

  // // Update filtered users whenever searchTerm changes
  useEffect(() => {
    const result = users.filter(
      (user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredUsers(result);
  }, [searchTerm, users]); // Only rerun when searchTerm or users change

  // Handle input changes for new user form
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setNewUser((prev) => ({ ...prev, [id]: value }));
  };

  // Add new user
  const handleAddUser = async () => {
    try {
      setIsLoading(true);
      console.log(newUser)

      const newUserAdded= {
        name:newUser.name,
        email:newUser.email,
        password:newUser.password,
        role:newUser.role
      }

      console.log(cookie)

      const response = await axios.post(
        'http://localhost:5454/api/v1/user/createUser',
        newUserAdded, // `newUser` should be the request body
        {
          headers: {
            Authorization: `Bearer ${cookie}`, // Headers should be part of the config object
          }
        }
      );

      if (!response.success) {
        throw new Error("Failed to add user.");
      }

      const addedUser = await response.json();
      setUsers((prev) => [...prev, addedUser.data]); // Update users state

      setNewUser({ name: "", email: "",password:"", role: "" }); // Clear form
      toast.success(response.message)
      setIsLoading(false);
    } catch (err) {
      setError(err.message || "Failed to add user.");
      toast.error('')
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between mb-4">
          <div className="w-1/3">
            <Label htmlFor="user-search">Search Users</Label>
            <Input
              id="user-search"
              placeholder="Search by name or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button>Add New User</Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New User</DialogTitle>
                <DialogDescription>
                  Enter the details of the new user below.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-right">
                    Name
                  </Label>
                  <Input
                    id="name"
                    value={newUser.name}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="email" className="text-right">
                    Email
                  </Label>
                  <Input
                    id="email"
                    value={newUser.email}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="password" className="text-right">
                    Password
                  </Label>
                  <Input
                    id="password"
                    value={newUser.password}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>

                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="role" className="text-right">
                    Role
                  </Label>
                  <Input
                    id="role"
                    value={newUser.role}
                    onChange={handleInputChange}
                    className="col-span-3"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button type="button" disabled={isLoading} onClick={handleAddUser}>
                  {isLoading ? "Saving..." : "Save User"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Display error message */}
        {error && <p className="text-red-500">{error}</p>}

        {/* Display loading state */}
        {isLoading && !users.length ? (
          <p>Loading users...</p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Role</TableHead>
                <TableHead>Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredUsers.map((user, index) => (
                <TableRow key={index}>
                  <TableCell>{user.name}</TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>{user.role}</TableCell>
                  <TableCell>
                    <Button variant="link">Edit</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
