import React, {useState, useEffect, use} from 'react';
import { createClient } from '@supabase/supabase-js';

// Connect to Supabase
const supabaseUrl = 'https://djsrjatigmxnoaxydepq.supabase.co';
const supabaseKey = import.meta.env.VITE_SUPABASE_KEY;
// const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRqc3JqYXRpZ214bm9heHlkZXBxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU0OTYxNTcsImV4cCI6MjA5MTA3MjE1N30.vnj5TDsBS9edeBkqx2XHIxRjCbCNd1BePG1gjhqRDnI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Get a list of all the users in the database
const getUsers = async (name) => {
    let { data: users, error } = await supabase
        .from('users')
        .select('*')

    return users;
}

const addUser = async (name) => {
    const { data, error } = await supabase
        .from('users')
          .upsert(
            { name: name }, 
            { onConflict: 'name', ignoreDuplicates: true }
  )
}

const findUser = async (name) => {
    let { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('name', name)
        .maybeSingle();

    return data?.id;
}

const Login = ({inputUser}) => {
    const [allUsers, setAllUsers] = useState([]);
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            const users = await getUsers(inputUser);
            setAllUsers(users);
            console.log("All users: ", users);
        };

        const getUserID = async () => {
            const userId = await findUser(inputUser);
            setUserID(userId);
            console.log("User ID: ", userId);
        }

        fetchUsers();
        getUserID();
        
        if (!allUsers.map(user => user.id).includes(userID) && inputUser !== '' && userID !== null) {
            addUser(inputUser);
        }

    }, [inputUser]);



    return (
        <div>
            <p>NOTE: Everything the Login component displays is for testing purposes only.</p>
            <p>Logged in as: {inputUser}</p>

              <ul>
                    {allUsers.map((user, index) => (
                    <li key={index}>{user.name}</li>
                    ))}
                </ul>
                
        </div>
    )
};

export default Login;