import { useEffect, useState, } from 'react';
import authService from '../services/authService';

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
        }
    })

    return(

    )
}