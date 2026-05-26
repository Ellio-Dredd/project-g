import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://xuppaiqereczkkasdkse.supabase.co';
const supabaseKey = 'sb_publishable_fxy9bZrhK9w-IGH3nyhYvg_rYDgGgiL';

export const supabase = createClient(supabaseUrl, supabaseKey);
