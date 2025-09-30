const { supabase } = require('./supabase-client');

exports.handler = async (event) => {
    try {
        const shortCode = event.path.split('/').pop();
        
        // Get original URL from database
        const { data, error } = await supabase
            .from('links')
            .select('original_url')
            .eq('short_code', shortCode)
            .single();
        
        if (error || !data) {
            return {
                statusCode: 404,
                body: 'Link not found'
            };
        }
        
        // Update click count
        await supabase
            .from('links')
            .update({ clicks: supabase.raw('clicks + 1') })
            .eq('short_code', shortCode);
        
        return {
            statusCode: 200,
            body: `
                <!DOCTYPE html>
                <html>
                <head>
                    <meta http-equiv="refresh" content="0; url=${data.original_url}">
                </head>
                <body>
                    <p>Redirecting to <a href="${data.original_url}">${data.original_url}</a></p>
                </body>
                </html>
            `
        };
        
    } catch (error) {
        return {
            statusCode: 500,
            body: 'Server error'
        };
    }
};
