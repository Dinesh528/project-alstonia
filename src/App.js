import { useState, useEffect } from "react";
import {
  createStyles,
  Table,
  Checkbox,
  ScrollArea,
  Group,
  Avatar,
  Text,
  TextInput,
  Stack,
  Button,
  Paper,
} from "@mantine/core";
import dateFormat from "dateformat";
import { useForm } from "@mantine/form";

const useStyles = createStyles((theme) => ({
  rowSelected: {
    backgroundColor:
      theme.colorScheme === "dark"
        ? theme.fn.rgba(theme.colors[theme.primaryColor][7], 0.2)
        : theme.colors[theme.primaryColor][0],
  },
}));

function App() {
  const { classes, cx } = useStyles();
  const [selection, setSelection] = useState(["1"]);
  const [data, setData] = useState([]);

  const form = useForm({
    initialValues: {
      email: "",
      avatar: "",
    },
    validate: {
      email: (val) => (/^\S+@\S+$/.test(val) ? null : "Invalid email"),
    },
  });

  useEffect(() => {
    fetch("https://63c57732f80fabd877e93ed1.mockapi.io/api/v1/users")
      .then((res) => res.json())
      .then((data) => setData(data));
  }, []);

  const rows = data.map((item) => {
    const selected = selection.includes(item.id);
    return (
      <tr key={item.id} className={cx({ [classes.rowSelected]: selected })}>
        <td>
          <Checkbox
            checked={selection.includes(item.id)}
            onChange={() => console(item.id)}
            transitionDuration={0}
          />
        </td>
        <td>
          <Group spacing="sm">
            <Avatar size={26} src={item.avatar} radius={26} />
            <Text size="sm" weight={500}>
              {item.name}
            </Text>
          </Group>
        </td>
        <td>{item.email}</td>
        <td>{dateFormat(`${item.createdAt}`, "mmmm dS, yyyy")}</td>
      </tr>
    );
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("form", form);

    const data = { email: form.values.email, avatar: form.values.avatar };

    fetch("https://63c57732f80fabd877e93ed1.mockapi.io/api/v1/users", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("Success:", data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });

    form.setFieldValue("email", "");
    form.setFieldValue("avatar", "");
  };
  return (
    <div style={{display:"flex"}}>
       <div>
        <form onSubmit={handleSubmit}>
          <Stack>
            <Paper radius="md" p="xl" sx={{ width: 500,margin:"auto" }}>
              <h1>Post the data</h1>
              <TextInput
                required
                label="Email"
                placeholder="hello@mantine.dev"
                value={form.values.email}
                onChange={(event) =>
                  form.setFieldValue("email", event.currentTarget.value)
                }
                error={form.errors.email && "Invalid email"}
              />
              <TextInput
                label="Avatar"
                placeholder="Your Avatar"
                value={form.values.avatar}
                onChange={(event) =>
                  form.setFieldValue("avatar", event.currentTarget.value)
                }
              />
              <Stack sx={{ paddingTop: "10px" }}>
                <Button type="submit">submit</Button>
              </Stack>
            </Paper>
          </Stack>
        </form>
      </div>
     
      <Paper radius="md" p="xl" sx={{ width: 700,margin:"auto" }}>

        <Table sx={{ minWidth: 700 }} verticalSpacing="sm">
          <thead>
            <tr>
              <th style={{ width: 40 }}>
                <Checkbox
                  checked={selection.length === data.length}
                  indeterminate={
                    selection.length > 0 && selection.length !== data.length
                  }
                  transitionDuration={0}
                />
              </th>
              <th>User</th>
              <th>Email</th>
              <th>created At</th>
            </tr>
          </thead>
          <tbody>{rows}</tbody>
        </Table>
        </Paper>
 
     
    </div>
  );
}

export default App;
