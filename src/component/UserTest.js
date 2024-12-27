import React from "react";
import DataTable from "react-data-table-component";

const UserTest = () => {

    const data = [
        { id: 1, name: "John Doe", age: 28 },
        { id: 2, name: "Jane Smith", age: 34 },
        { id: 3, name: "Alice Johnson", age: 25 },
      ];
      
      const columns = [
        {
          name: "ID",
          selector: (row) => row.id,
          sortable: true,
        },
        {
          name: "Name",
          selector: (row) => row.name,
          sortable: true,
        },
        {
          name: "Age",
          selector: (row) => row.age,
          sortable: true,
        },
      ];
  return (
    <div>
      <h1>React Data Table Example</h1>
      <DataTable
        title="User Data"
        columns={columns}
        data={data}
        pagination
      />
    </div>
  );
};

export default UserTest;
