'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export default async function getIngredients(transcript: string) {
    const cookieStore = cookies();
    const supabase = createClient(cookieStore);
    const {data, error } = await supabase.functions.invoke('get_ingredients', {
        body: JSON.stringify({query: transcript})
    })
    if (data) {
        return JSON.parse(data);
    } else {
        return {};
    }
}