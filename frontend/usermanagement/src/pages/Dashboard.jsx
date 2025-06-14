import { useEffect, useState, } from 'react';
import { authService } from '../services/authService';
import "../styles/Dashboard.css";

const PasswordChangeModel = ({isOpen, onClose, onSave}) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const [error, setError] = useState('');

    const handleSave = async () => {
        
        //basic validation
        if (newPassword !== confirmPassword){
            setError("Password does not match");
            return;
        }
        try{
            await authService.changePassword(currentPassword, newPassword, confirmPassword);
            onSave();
            onClose();
        }
        catch (error){
            setError("Failed to change the current Password");
        }
    };

    if (!isOpen) return null;

    return (
        <div className="model-overlay">
            <div className="model-content">
                <h2>Change Password</h2>
                {error && <div className='error-message'>{error}</div>}
                <div className="form-group">
                    <label>Current Password</label>
                    <input 
                    type="passowrd"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>New Password</label>
                    <input 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)} 
                    />
                </div>
                <div className="form-group">
                    <label>Confirm Password</label>
                    <input 
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)} 
                    />
                </div>
                <div className="model-actions">
                    <button className='btn btn-secondary' onClick={onClose}>Cancel</button>
                    <button className='btn btn-primary' onClick={handleSave}>Save</button>
                </div>
            </div>
        </div>
    )
}

const UsersTable = () => {
    const [allusers, setAllUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllUsers = async () => {
            try {
                const response = await authService.getAllUsers();
                setAllUsers(response);
                setLoading(false);
            }
            catch(error){
                setError('Failed to get users');
                setLoading(false);
            }
            
        };
        fetchAllUsers();
    }, []);

    const handleDeleteUser = async (userId) => {
        try{
            await authService.deleteUser(userId);
            setAllUsers(allusers.filter(user => user.id !== user));
        }
        catch(error){
            console.error("Failed to delete the user")
        }
    };

    if (loading) return <div>Loading users...</div>
    if (error) return <div className='error-message'>{error}</div>

    return (
        <div className="users-table-container">
            <h3>Manage All Users</h3>
            <table className='users-table'>
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {allusers.map(user => {
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>
                                <button className='btn btn-danger' onClick={() => handleDeleteUser(user.id)}>Delete User</button>
                            </td>
                        </tr>
                    })}
                </tbody>
            </table>
        </div>
    );
};

const Dashboard = () => {

    const [user, setUser] = useState(null);
    const [activeSection, setActiveSection] = useState('home');
    const [loading, setLoading] = useState(true);

    //Admin
    const [isAdmin, setIsAdmin] = useState(false);

    //profile editing status
    const [isEditing, setIsEditing] = useState(false);
    const [editedUser, setEditedUser] = useState({});

    //password model
    const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const currentUser = authService.getCurrentUser();
                setUser(currentUser);
                setEditedUser(currentUser);

                //check if the user role is admin or user
                const userRoles = currentUser.roles || [];
                setIsAdmin(userRoles.includes('ROLE_ADMIN'));
            }
            catch (error) {
                console.error("Error fetching user data", error);
            }
            finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleEditToggle = () => {
        setIsEditing(!isEditing);
    };
    const handleInputChange = (e) => {
        const {name, value} = e.target;
        setEditedUser(prev => ({
            ...prev,
            [name]: value
        }));
    };
    const handleSaveProfile = async () => {
        try {
            await authService.updateProfile(editedUser);
            setUser(editedUser);
            setIsEditing(false);
        }
        catch (error) {
            console.error("Failed to update profile", error);
        }
    };
    const handleCancelEdit = () => {
        setEditedUser(user);
        setIsEditing(false);
    };
    if (loading) {
        return <div className="loading-spinner">Loading...</div>;
    }

    return(
        <div className="dashboard-container">
            <div className="dashboard-sidebar">
                <div className={`dashboard-menu-item ${activeSection === 'home' ? 'active' : ''}`}
                    onClick={()=> setActiveSection('home')}>
                        Home
                </div>
                <div className={`dashboard-menu-item ${activeSection === 'profile' ? 'active' : ''}`}
                    onClick={()=> setActiveSection('profile')}>
                        Profile
                </div>
                <div className={`dashboard-menu-item ${activeSection === 'settings' ? 'active' : ''}`}
                    onClick={()=> setActiveSection('settings')}>
                        Settings
                </div>

                {isAdmin && (
                    <div className={`dashboard-menu-item ${activeSection === 'users' ? 'active' : ''}`}
                        onClick={()=> setActiveSection('users')}>
                            Users
                    </div>
                )}
            </div>

            <div className="dashboard-content">
                {activeSection === 'home' && (
                    <div className="dashboard-home">
                        <h2>Welcome {user.username}</h2>
                        <p>Your email: {user.email}</p>
                    </div>
                )}

                {activeSection === 'profile' && (
                    <div className="dashboard-profile">
                        <h2>User Profile Information</h2>
                        
                        <div className="profile-field">
                            <label>Username:</label>
                            <input 
                            type="text"
                            name='username'
                            value={isEditing ? editedUser.username : user.username}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            />
                        </div>

                        <div className="profile-field">
                            <label>Email:</label>
                            <input 
                            type="email"
                            name='email'
                            value={isEditing ? editedUser.email : user.email}
                            onChange={handleInputChange}
                            readOnly={!isEditing}
                            />
                        </div>

                        <div className="profile-actions">
                            {!isEditing ? (
                                <>
                                    <button className='btn btn-primary' onClick={handleEditToggle}>
                                        Edit
                                    </button>

                                    <button className='btn btn-secondary' onClick={()=> setIsPasswordModalOpen(true)}>
                                        Change Password
                                    </button>
                                </>
                            ) : (
                                <>
                                    <button className='btn btn-primary' onClick={handleSaveProfile}>
                                        Save
                                    </button>
                                    <button className='btn btn-secondary' onClick={handleCancelEdit}>
                                        Cancel
                                    </button>
                                </>
                            )}
                        </div>
                    </div>
                )}

                {activeSection === 'settings' && (
                    <div className="dashboard-settings">
                        <h2>Settings</h2>
                        <p>Manage your account settings here.</p>
                    </div>
                )}
                {
                    activeSection === 'users' && isAdmin && (
                        <UsersTable />
                    )
                }
            </div>
            <PasswordChangeModel 
                isOpen={isPasswordModalOpen}
                onClose={()=> setIsPasswordModalOpen(false)}
                onSave={()=> {
                    console.log("Passoword Changed Successfully")
                }}
            />
        </div>
    );
};

export default Dashboard;