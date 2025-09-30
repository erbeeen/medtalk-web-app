import { useState, useEffect } from "react";
import { createColumnHelper } from "@tanstack/react-table";
import type { MedicineType } from "../types/medicine";
import ScrollTableData from "../components/ScrollTableData";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import SearchBar from "../components/SearchBar";
import Table from "../components/Table";
import MedicineAddModal from "../components/modals/MedicineAddModal";
import MedicineEditModal from "../components/modals/MedicineEditModal";
import MedicineDeleteModal from "../components/modals/MedicineDeleteModal";

type MedicineRouteProps = {
  scrollToTop: () => void;
}

export default function MedicineRoute({ scrollToTop }: MedicineRouteProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [medicines, setMedicines] = useState<Array<MedicineType>>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [searchText, setSearchText] = useState("");
  const [globalFilter, setGlobalFilter] = useState<any>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteAllModalOpen, setIsDeleteAllModalOpen] = useState(false);

  useEffect(() => {
    document.title = "Medicines | MedTalk";


    const fetchData = async () => {
      try {
        const response = await fetch("/api/medicine/all", {
          mode: "cors",
          method: "GET",
          credentials: "include"
        })

        const data = await response.json();
        setMedicines(data.data);
      } catch (err) {
        console.error("loading medicine data failed: ", err);
      }
    }

    const loadData = async () => {
      try {
        setIsLoading(true);
        await fetchData();
        setIsLoading(false);
      } catch (err) {
        console.error("error fetching data: ", err);
        alert(`error fetching data: ${err}`);
        setIsLoading(false);
      }
    }

    loadData();

  }, []);


  const medicineColumnHelper = createColumnHelper<MedicineType>();
  const medicineColumns = [
    medicineColumnHelper.accessor("status", {
      header: (props) => (
        <div className="w-full flex justify-center items-center">
          <input
            type="checkbox"
            checked={props.table.getIsAllRowsSelected()}
            onChange={props.table.getToggleAllRowsSelectedHandler()} />
        </div>
      ),
      cell: (props) => (
        <div className="w-full flex justify-center items-center">
          <input
            type="checkbox"
            checked={props.row.getIsSelected()}
            onChange={props.row.getToggleSelectedHandler()} />
        </div>
      ),
      size: 50,
      minSize: 50,
    }),
    // medicineColumnHelper.accessor("_id", {
    //   header: "_id",
    //   cell: props => <ScrollTableData props={props} />,
    //   size: 200,
    //   minSize: 50,
    // }),
    medicineColumnHelper.accessor("Molecule", {
      header: "Molecule",
      cell: props => <ScrollTableData props={props} />,
      enableGlobalFilter: false,
      size: 200,
      minSize: 150,
    }),
    medicineColumnHelper.accessor("Level 1", {
      header: "Level 1 Info",
      cell: props => <ScrollTableData props={props} />,
      size: 300,
      minSize: 300,
    }),
    medicineColumnHelper.accessor("Level 2", {
      header: "Level 2 Info",
      cell: props => <ScrollTableData props={props} />,
      size: 250,
    }),
    medicineColumnHelper.accessor("Level 3", {
      header: "Level 3 Info",
      cell: props => <ScrollTableData props={props} />,
      size: 250,
    }),
    medicineColumnHelper.accessor("Level 4", {
      header: "Level 4 Info",
      cell: props => <ScrollTableData props={props} />,
      size: 250,
    }),
    medicineColumnHelper.accessor("Route", {
      header: "Route",
      cell: props => <ScrollTableData props={props} />,
      enableGlobalFilter: false,
      size: 200,
      minSize: 150,
    }),
    medicineColumnHelper.accessor("Technical Specifications", {
      header: "Technical Specifications",
      cell: props => <ScrollTableData props={props} />,
      enableGlobalFilter: false,
      size: 250,
      minSize: 150,
    }),
    medicineColumnHelper.accessor("ATC Code", {
      header: "ATC Code",
      cell: props => <ScrollTableData props={props} />,
      enableGlobalFilter: false,
      size: 200,
      minSize: 150,
    }),
    medicineColumnHelper.accessor("actions", {
      header: "",
      size: 115,
      cell: (props) => {
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
        return (
          <div className="text-center">
            <button
              type="button"
              className="p-1.5 mx-1 border bg-edit hover:bg-edit/70 border-edit text-black rounded-md cursor-pointer"
              onClick={() => setIsEditModalOpen(true)}>
              <FaEdit />
            </button>
            {isEditModalOpen && (
              <MedicineEditModal key={props.row.id}
                onClose={() => {
                  setIsEditModalOpen(false);
                  setRowSelection({});
                }}
                data={props.row.original}
                setMedicines={setMedicines} />
            )}
            <button
              type="button"
              className="p-1.5 mx-1 text-white bg-delete hover:bg-delete/70 border border-delete rounded-md cursor-pointer"
              onClick={() => setIsDeleteModalOpen(true)}>
              <FaTrash />
            </button>
            {isDeleteModalOpen && (
              <MedicineDeleteModal
                onClose={() => {
                  setIsDeleteModalOpen(false);
                  setRowSelection({});
                }}
                data={props.row.original}
                setMedicines={setMedicines} />
            )}
          </div>
        );
      }
    }),
  ];

  return (
    <div className="base-layout flex flex-col items-center gap-4">

      <div className="self-start">
        <h1 className="text-2xl font-bold">Medicine Management</h1>
      </div>

      <div className="h-10 w-full mb-2 self-start flex items-center gap-5">
        <div className="w-10/12">
          <SearchBar
            onChange={(value: string) => setSearchText(value)}
            searchFn={() => setGlobalFilter(searchText)}
            clearFn={() => {
              setSearchText("");
              setGlobalFilter([]);
            }}
            value={searchText}
          />
        </div>

        <div className="w-2/12 flex justify-end gap-2">
          <div className="px-2 py-1.5 flex justify-center flex-nowrap items-center 
            cursor-pointer rounded-md bg-primary hover:bg-primary/80 text-white"
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus size="1.2rem" />
          </div>
          {isAddModalOpen && (
            <MedicineAddModal
              onClose={() => setIsAddModalOpen(false)}
              setMedicines={setMedicines}
            />
          )}
          <div>
            {Object.keys(rowSelection).length != 0 && (
              <button
                type="button"
                className="p-2 rounded-md text-white bg-delete hover:bg-delete/70 cursor-pointer"
                onClick={() => setIsDeleteAllModalOpen(true)}>
                <FaTrash size="1.2rem" />
              </button>
            )}
            {isDeleteAllModalOpen && (
              <MedicineDeleteModal
                onClose={() => {
                  setIsDeleteAllModalOpen(false);
                  setRowSelection({});
                }}
                data={rowSelection}
                setMedicines={setMedicines} />
            )}
          </div>
        </div>

      </div>
      {isLoading ?
        <div className="spinner size-10 border-5"></div>
        :
        <Table
          columns={medicineColumns}
          content={medicines}
          rowSelection={rowSelection}
          onRowSelectionChange={setRowSelection}
          globalFilter={globalFilter}
          setGlobalFilter={setGlobalFilter}
          scrollToTop={scrollToTop}
        />
      }
    </div>
  );
}
