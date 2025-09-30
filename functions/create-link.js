const { supabase } = require('./supabase-client');

exports.handler = async (event) => {
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
        const { url, customName, userId } = JSON.parse(event.body);
        
        let shortCode;
        if (customName) {
            shortCode = customName;
        } else {
            shortCode = Math.random().toString(36).substring(2, 8);
        }
        
        // Insert link into database
        const { data, error } = await supabase
            .from('links')
            .insert([{
                user_id: userId,
                short_code: shortCode,
                original_url: url,
                custom_name: customName || null,
                clicks: 0,
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
                shortUrl: `https://your-domain.netlify.app/r/${shortCode}`,
                link: data[0]
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
