import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import automaticLogin from "../auth/auth";
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
  const navigate = useNavigate();
  useEffect(() => {
    document.title = "Medicines | MedTalk";

    const loadData = async () => {
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

    setIsLoading(true);
    const loginAndLoadData = async () => {
      try {
        await automaticLogin(navigate, "/medicine");
        await loadData();
      } catch (err) {
        console.error("login failed: ", err);
      } finally {
        setIsLoading(false);
      }
    }


    loginAndLoadData();
    setIsLoading(false);

  }, []);


  // TODO: Set medications data

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
    medicineColumnHelper.accessor("_id", {
      header: "_id",
      cell: props => <ScrollTableData props={props} />,
      size: 200,
      minSize: 50,
    }),
    medicineColumnHelper.accessor("Level 1", {
      header: "Level 1",
      cell: props => <ScrollTableData props={props} />,
      size: 300,
      minSize: 300,
    }),
    medicineColumnHelper.accessor("Level 2", {
      header: "Level 2",
      cell: props => <ScrollTableData props={props} />,
      size: 250,
    }),
    medicineColumnHelper.accessor("Level 3", {
      header: "Level 3",
      cell: props => <ScrollTableData props={props} />,
      size: 250,
    }),
    medicineColumnHelper.accessor("Level 4", {
      header: "Level 4",
      cell: props => <ScrollTableData props={props} />,
      size: 250,
    }),
    medicineColumnHelper.accessor("Molecule", {
      header: "Molecule",
      cell: props => <ScrollTableData props={props} />,
      enableGlobalFilter: false,
      size: 200,
      minSize: 150,
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
      size: 125,
      cell: (props) => {
        const [isEditModalOpen, setIsEditModalOpen] = useState(false);
        const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
        return (
          <div className="text-center">
            <button
              type="button"
              className="p-1.5 mx-1.5 border border-edit-dark/70 dark:hover:bg-edit-dark/70 
              dark:text-edit-dark dark:hover:text-dark-text rounded-md cursor-pointer"
              onClick={() => setIsEditModalOpen(true)}>
              <FaEdit size="1.2rem" />
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
              className="p-1.5 mx-1.5 border dark:border-delete-dark/50 dark:hover:bg-delete-dark/50 
              dark:text-delete-dark/50 dark:hover:text-dark-text rounded-md cursor-pointer"
              onClick={() => setIsDeleteModalOpen(true)}>
              <FaTrash size="1.2rem" />
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

        <div className="w-2/12 flex justify-end gap-3">
          <div className="p-2 flex justify-center flex-nowrap items-center cursor-pointer
            border dark:border-primary-dark/60 dark:hover:bg-primary-dark/80 
            dark:text-primary-dark/60 dark:hover:text-dark-text rounded-md "
            onClick={() => setIsAddModalOpen(true)}
          >
            <FaPlus size="1.3rem" />
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
                className="p-2 border rounded-md dark:border-delete-dark/50 
                dark:hover:bg-delete-dark/50 dark:text-delete-dark/50 
                dark:hover:text-dark-text cursor-pointer"
                onClick={() => setIsDeleteAllModalOpen(true)}>
                <FaTrash size="1.3rem" />
              </button>
            )}
            {isDeleteAllModalOpen && (
              <MedicineDeleteModal
                onClose={() => setIsDeleteAllModalOpen(false)}
                data={rowSelection}
                setMedicines={setMedicines} />
            )}
          </div>
        </div>

      </div>
      {!isLoading &&
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
