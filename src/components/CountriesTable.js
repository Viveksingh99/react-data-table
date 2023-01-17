import React, { useState, useEffect } from "react";
import DataTable from "react-data-table-component";
import axios from "axios";

function CountriesTable() {
  const [Countries, setCountries] = useState([]);
  const [search, setSearch] = useState("");
  const [filterCountry, setFilterCountry] = useState([]);
  const [selectedRows, setSelectedRows] = React.useState("");
  const [toggleCleared, setToggleCleared] = React.useState(false);
  const [pending, setPending] = useState(true);
  const [deletedData, setDeletedData] = useState([]);

  // const [data, setData] = React.useState(tableDataItems);

  const handleRowSelected = React.useCallback((row) => {
    const arr = row.selectedRows?.map((x) => x.name);
    setSelectedRows([...selectedRows, arr]);
  }, []);
  // console.log("first", selectedRows);

  const contextActions = React.useMemo(() => {
    const handleDelete = () => {
      if (
        window.confirm(`Are you sure you want to delete:\r ${selectedRows}`)
      ) {
        setToggleCleared(!toggleCleared);
        const b = selectedRows.join(" ");
        let a = filterCountry;
        a = filterCountry.filter((x) => {
          return !b.includes(x.name);
        });
        setFilterCountry(a);
        let c = filterCountry;
        c = filterCountry.filter((x) => {
          return b.includes(x.name);
        });
        setDeletedData(c);
      }
    };
    return (
      <button
        key="delete"
        onClick={handleDelete}
        style={{
          backgroundColor: "red",
          border: "none",
          height: "40px",
          width: "100px",
          borderRadius: "5px",
        }}
        icon
      >
        Delete
      </button>
    );
  }, [filterCountry, selectedRows, toggleCleared]);

  const getCountries = async () => {
    try {
      const response = await axios.get("https://restcountries.com/v2/all");
      setCountries(response.data);
      setFilterCountry(response.data);
      setPending(false);
    } catch (error) {
      console.log(error);
    }
    setPending(false);
  };

  const columns = [
    {
      name: "Country Name",
      selector: (row) => row.name,
      sortable: true,
    },
    {
      name: "Country Native Name",
      selector: (row) => row.nativeName,
    },
    {
      name: "Country Capital",
      selector: (row) => row.capital,
    },
    {
      name: "Country Flag",
      selector: (row) => <img src={row.flag} alt="" width={50} height={50} />,
    },
    {
      name: "Edit",
      cell: (row) => (
        <button
          class="btn btn-primary"
          type="button"
          onClick={() => alert(row.name)}
        >
          Edit
        </button>
      ),
    },
    {
      name: "Delete",
      cell: (row) => (
        <button
          class="btn btn-danger"
          type="button"
          onClick={() => alert(row.name)}
        >
          Delete
        </button>
      ),
    },
  ];

  useEffect(() => {
    getCountries();
  }, []);

  useEffect(() => {
    const result = Countries.filter((el) => {
      return el.name.toLowerCase().match(search.toLowerCase());
    });
    setFilterCountry(result);
  }, [search]);
  // console.log("first", data);
  return (
    <div>
      <DataTable
        columns={columns}
        data={filterCountry}
        pagination
        fixedHeader
        fixedHeaderScrollHeight="250px"
        selectableRows
        selectableRowsHighlight
        highlightOnHover
        subHeader
        progressPending={pending}
        subHeaderComponent={
          <input
            placeholder="Search"
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        }
        title="Desserts"
        contextActions={contextActions}
        onSelectedRowsChange={handleRowSelected}
        clearSelectedRows={toggleCleared}
      />
      <p>deletedData</p>
      <DataTable columns={columns} data={deletedData} />
    </div>
  );
}

export default CountriesTable;
