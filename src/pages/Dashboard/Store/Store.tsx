import {
  // Autocomplete,
  // AutocompleteItem,
  Button,
  getKeyValue,
  Input,
  Pagination,
  Selection,
} from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@nextui-org/react";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  get_stocks_states_docs,
  get_stocks_states_docs_by_barcode,
} from "../../../services/stocks_service";
import { StockState } from "../../../types/Stock.types";
import formatNumberWithComma from "../../../helpers/formatNumberWithComma";
import { FaCartPlus } from "react-icons/fa6";
import { FaHandHoldingDollar } from "react-icons/fa6";
import { MdOutlinePriceCheck } from "react-icons/md";
import { FaArrowsRotate } from "react-icons/fa6";
import { FaEdit, FaPlus } from "react-icons/fa";
import toast, { Toaster } from "react-hot-toast";

type Props = {};

const columns = [
  {
    key: "item_name",
    label: "ناڤ",
  },
  {
    key: "amount_in_pcs",
    label: "عدد",
  },
  {
    key: "current_pcs",
    label: "ماین",
  },
  {
    key: "pc_barcode",
    label: "بارکود",
  },
  {
    key: "pc_cost",
    label: "کرین",
  },
  {
    key: "pc_price",
    label: "فروتن",
  },
].reverse();

export default function Store({}: Props) {
  const navigate = useNavigate();
  const marketCostRef = useRef(0);
  const marketPriceRef = useRef(0);
  const itemRef = useRef<StockState | undefined>(undefined);
  const [rows, setRows] = useState<StockState[] | []>([]);
  const [page, setPage] = useState(1);
  const rowsPerPage = 10;
  const [state, setState] = useState({
    barcode: "",
  });

  const pages = Math.ceil(rows?.length / rowsPerPage);

  const items = useMemo(() => {
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;

    return rows?.slice(start, end);
  }, [page, rows]);

  const listStockDocuments = async () => {
    const res = await get_stocks_states_docs();
    res?.data && setRows(res?.data);
    if (res?.data) {
      console.log(res.data);
      let marketCost = 0;
      let marketPrice = 0;
      res?.data.forEach((stock: StockState) => {
        marketCost =
          marketCost + (stock?.current_pcs || 1) * (stock?.pc_cost || 1);
        marketPrice =
          marketPrice + (stock?.current_pcs || 1) * (stock?.pc_price || 1);
      });

      marketCostRef.current = marketCost;
      marketPriceRef.current = marketPrice;
    }
  };

  useEffect(() => {
    listStockDocuments();
    // listItems();
  }, []);

  const reload = () => {
    listStockDocuments();
  };

  const listStockDocumentsByBarcode = async () => {
    if (state.barcode) {
      try {
        const res = await get_stocks_states_docs_by_barcode(state.barcode);
        res?.data && setRows(res?.data);
        // setState({ ...state, itemName: '' })
      } catch (error) {
        console.log(error);
      }
    }
  };

  const notify = (msg: string) => toast.error(msg);

  return (
    <main className="p-4 bg-white h-lvh">
      <Toaster reverseOrder={true} />
      <header dir="rtl" className="flex flex-col gap-y-4">
        <div className="flex justify-normal items-center	 lg:flex-nowrap md:flex-wrap sm:flex-wrap gap-4">
          <Input
            dir="ltr"
            type="text"
            label="بارکود"
            labelPlacement="inside"
            id="barcode"
            radius="sm"
            size="md"
            variant="bordered"
            color="primary"
            className="w-[400px] mr-2 text-[18px] font-bold"
            style={{ textAlign: "left" }}
            value={state.barcode}
            onChange={(e) => setState({ ...state, barcode: e.target.value })}
            onKeyDown={(e) => {
              // barcode steps: Tab key ==> barcode value ==> Enter key
              if (e.key === "Tab") {
                e.preventDefault(); // Prevent default behavior
              }
              if (e.key === "Enter") {
                // @ts-ignore
                const input: HTMLInputElement | null =
                  document.getElementById("barcode");
                input?.focus();
                input?.select();
                listStockDocumentsByBarcode();
              }
            }}
          />

          {/* reload */}
          <Button
            size="md"
            isIconOnly
            aria-label="reload"
            variant="light"
            onClick={reload}
          >
            <FaArrowsRotate style={{ fontSize: "20px" }} />
          </Button>
          {/* new item */}
          <Button
            size="md"
            color="primary"
            className="rounded-[5px]"
            onClick={() => navigate("newitem")}
            endContent={<FaPlus />}
          >
            زێدەکرن
          </Button>
          <Button
            size="md"
            color="primary"
            className="rounded-[5px]"
            onClick={() => navigate("stock")}
            endContent={<FaCartPlus />}
          >
            سەر زێدەکرن
          </Button>
          {/* edit */}
          <Button
            size="md"
            aria-label="edit button"
            color="secondary"
            className="rounded-[5px]"
            onClick={() => {
              if (!itemRef.current) {
                notify("هیڤیدکەین رێکوردەکی هەلبژێرە");
              } else {
                navigate("updatestock", { state: itemRef.current });
              }
            }}
            // isDisabled={!itemRef.current ? true : false}
            endContent={<FaEdit />}
          >
            زانیاری
          </Button>
        </div>
      </header>
      <section className="text-right m-2 mt-4">
        {/* table */}
        <Table
          // isStriped
          // shadow="lg"
          className="rounded-xl shadow-[0px_0px_15px_rgba(0,0,0,0.3)]"
          aria-label="stock data table"
          selectionMode="single"
          bottomContent={
            <div className="flex w-full justify-center" dir="ltr">
              <Pagination
                isCompact
                showControls
                showShadow
                color="secondary"
                page={page}
                total={pages}
                // @ts-ignore
                onChange={(page) => setPage(page)}
              />
            </div>
          }
          classNames={{
            wrapper: "min-h-[222px]",
          }}
          onSelectionChange={(keys: Selection) => {
            // console.log(keys[0]);
            if (keys !== "all") {
              // const stateId = keys.values().next().value
              // keys is of type set
              // converting set to array needs destructing set
              const stateId = [...keys][0];
              itemRef.current = items.find(
                (item) => item.state_id === Number(stateId)
              );
              // console.log(itemRef.current)
            }
          }}
        >
          <TableHeader>
            {columns.map((column) => (
              <TableColumn
                className="text-right text-[16px] font-bold text-stone-800"
                key={column.key}
              >
                {column.label}
              </TableColumn>
            ))}
          </TableHeader>
          <TableBody items={items}>
            {(item) => (
              <TableRow
                key={item.state_id}
                className="border-b-1 border-stale-500"
              >
                {(columnKey) => {
                  if (columnKey === "pc_cost") {
                    return (
                      <TableCell>
                        <span className="text-orange-700 text-[16px]">
                          {formatNumberWithComma(getKeyValue(item, "pc_cost"))}
                        </span>
                      </TableCell>
                    );
                  }
                  if (columnKey === "pc_price") {
                    return (
                      <TableCell>
                        <span className="text-teal-700 text-[16px]">
                          {formatNumberWithComma(getKeyValue(item, "pc_price"))}
                        </span>
                      </TableCell>
                    );
                  }
                  // else

                  return (
                    <TableCell className="text-[16px]">
                      {getKeyValue(item, columnKey)}
                    </TableCell>
                  );
                }}
              </TableRow>
            )}
          </TableBody>
        </Table>
      </section>
      <footer className="m-4 flex items-center gap-x-6">
        <div
          dir="rtl"
          className="flex items-center	text-green-800 gap-x-2"
          style={{ fontSize: "18px" }}
        >
          <strong> {formatNumberWithComma(marketPriceRef.current)}</strong>
          <strong className="ml-2">
            {" "}
            <FaHandHoldingDollar size="26px" />
          </strong>
        </div>
        <div
          dir="rtl"
          className="flex items-center	text-indigo-700	gap-x-2"
          style={{ fontSize: "18px" }}
        >
          <strong> {formatNumberWithComma(marketCostRef.current)}</strong>
          <strong className="ml-2">
            {" "}
            <MdOutlinePriceCheck size="26px" />
          </strong>
        </div>
      </footer>
    </main>
  );
}
