'use server'

import { cookies } from 'next/headers'
import { AisleData } from '@/components/List';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';

export default async function sendList(email: string, sectionData: AisleData[] | undefined) {
    const cookieStore = cookies();
    const supabase = createServerComponentClient({ cookies: () => cookieStore });
    let emailText = '';
    if (sectionData && sectionData.length > 0) {
        emailText = sectionData.map((aisle) => {
            return '<strong>'+aisle.name+'</strong>'+'<br>-'+aisle.items.join('<br>-');
        }).join('<br><br>');
    }
    const { data } = await supabase.functions.invoke('send_grocery_list_email', {
        body: JSON.stringify({email: email, list: emailText})
    });
    if (data.id) { 
        return data;
    } else {
        return null;
    }
}