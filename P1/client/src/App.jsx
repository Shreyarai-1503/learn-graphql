import { useQuery, gql } from "@apollo/client";

const GET_TODOS = gql`
  query GetTodosWithUser {
    getTodos {
      id
      title
      user {
        name
      }
    }
  }
`;

function App() {
  const { loading, error, data } = useQuery(GET_TODOS);

  if (loading) return <h1>Loading</h1>;
  if (error) return <h1>Error: {error}</h1>;

  //console.log(data.getTodos[1].completed)
  return (
    <table>
      <tbody>
        {data.getTodos.slice(0, 100).map((todo) => (
          <tr key={todo.id}>
            <td>{todo.title}</td>
            <td>{todo.user.name}</td>
          </tr>
        ))}
      </tbody>
    </table>
    // <div>{JSON.stringify(data.getTodos)}</div>
  );
}

export default App;
