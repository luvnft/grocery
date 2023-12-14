'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { AisleData } from '@/components/List';

export default async function getIngredients(sectionData: AisleData[] | undefined, transcript: string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    let additionalText = '';
    if (sectionData && sectionData.length > 0) {
        additionalText = ' and also:'+sectionData.map((aisle) => {
            return ' '+aisle.name+' ('+aisle.items.join(',')+')';
        }).join(',');
        console.log(transcript, additionalText);
    }
    const {data, error } = await supabase.functions.invoke('get_ingredients', {
        body: JSON.stringify({query: (transcript + additionalText)})
    })
    if (data) {
        console.log(data);
        return JSON.parse(data);
    } else {
        return {};
    }
}