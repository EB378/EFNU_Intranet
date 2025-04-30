"use client";

import { dataProvider as dataProviderSupabase } from "@refinedev/supabase";
import { supabaseBrowserClient } from "@/utils/supabase/client";

const supabase = supabaseBrowserClient();
export const dataProvider = dataProviderSupabase(supabase);
