import { getArtistCredentials, checkEmailExists } from "@/app/actions/user";


export default async function CredentialsList() {
  const users = await getArtistCredentials();
  const emailToCheck = await checkEmailExists("jeavenanda0@gmail.com");

  console.log("Email existence check for CredentialsList:", emailToCheck);
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Artist Credentials</h2>
      <div className="grid gap-4">
        {users.map((user) => (
          <div key={user.user_id} className="p-4 border rounded-lg shadow-sm">
            <p className="font-semibold">{user.gmail}</p>
            <p className="text-sm text-gray-500">
              Joined: {new Date(user.created_at).toLocaleDateString()}
            </p>
            <span className={`text-xs p-1 rounded ${user.is_logged_in ? 'bg-green-100' : 'bg-gray-100'}`}>
              {user.is_logged_in ? "Online" : "Offline"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}