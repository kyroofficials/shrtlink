const { supabase } = require('./supabase-client');

exports.handler = async (event) => {
    // Handle CORS
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
                'Access-Control-Allow-Methods': 'POST, OPTIONS'
            },
            body: ''
        };
    }
    
    try {
        const { username, email, password } = JSON.parse(event.body);
        
        // Insert user into database
        const { data, error } = await supabase
            .from('users')
            .insert([{ 
                username, 
                email, 
                password_hash: password, // In real app, hash this!
                created_at: new Date()
            }])
            .select();
        
        if (error) throw error;
        
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                success: true, 
                user: data[0] 
            })
        };
        
    } catch (error) {
        return {
            statusCode: 400,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ 
                success: false, 
                error: error.message 
            })
        };
    }
};
