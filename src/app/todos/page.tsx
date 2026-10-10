import { createClient } from '@/utils/supabase/server';
import { cookies } from 'next/headers';

export default async function Page() {
  const cookieStore = await cookies();
  const supabase = createClient(cookieStore);

  const { data: todos } = await supabase.from('todos').select();

  return (
    <div className="p-8">
      <h1 className="text-xl font-bold mb-4">Supabase Connection Test</h1>
      <ul className="list-disc pl-5">
        {todos && todos.length > 0 ? (
          todos.map((todo: any) => (
            <li key={todo.id}>{todo.name || todo.title || JSON.stringify(todo)}</li>
          ))
        ) : (
          <li className="text-gray-500">No todos found (or table not created yet). Connection initialized successfully!</li>
        )}
      </ul>
    </div>
  );
}
