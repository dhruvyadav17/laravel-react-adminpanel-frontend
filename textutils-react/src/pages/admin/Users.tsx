import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsersThunk } from "../../store/userSlice";
import { RootState, AppDispatch } from "../../store";

export default function Users() {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading } = useSelector(
    (s: RootState) => s.users
  );

  useEffect(() => {
    dispatch(fetchUsersThunk());
  }, []);

  return (
    <div className="container mt-4">
      <h3>Users</h3>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <table className="table table-bordered">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Roles</th>
            </tr>
          </thead>
          <tbody>
            {list.map((u) => (
              <tr key={u.id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  {u.roles?.map((r: any) => r.name).join(", ")}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
