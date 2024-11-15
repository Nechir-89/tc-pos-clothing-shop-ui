import { useContext, useEffect, useState } from "react";
import { UserContext, UserContextType } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import {
  Avatar,
  Button,
  Input,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  getKeyValue,
} from "@nextui-org/react";
import formatNumberWithComma from "../../helpers/formatNumberWithComma";
import {
  Fa0,
  Fa1,
  Fa2,
  Fa3,
  Fa4,
  Fa5,
  Fa6,
  Fa7,
  Fa8,
  Fa9,
} from "react-icons/fa6";
import { TiArrowSortedDown, TiArrowSortedUp } from "react-icons/ti";
import { BiSolidLeftArrow, BiSolidRightArrow } from "react-icons/bi";
import { IoIosLogOut } from "react-icons/io";
import extractTimeFromDate from "../../helpers/extractTimeFromDate";
import ChangeAmount from "../../components/ChangeAmount";
import { InvoiceItemType } from "../../types/InvoiceItem.types";
import DeleteInvoiceItem from "../../components/DeleteInvoiceItem";
import {
  InvoiceContext,
  InvoiceContextType,
} from "../../contexts/InvoiceContext";
import Gifft from "../../components/Gifft";
import InvoiceSearch from "../../components/InvoiceSearch";
import SelectingPaymentModel from "../../components/SelectingPaymentModel";
import { get_active_payment_methods } from "../../services/payment_methods_service";
import { PaymentMethod } from "../../types/PaymentMethod.types";
import { FiPrinter } from "react-icons/fi";
import { generateHtmlForPrinting } from "../../helpers/GeneratingHTMLForPrinting";
import extractDateFromDate from "../../helpers/extractDateFromDate";
import { FaCartArrowDown } from "react-icons/fa6";

type Props = {};

const columns = [
  {
    key: "subtotal",
    label: "بهایێ گشتی",
  },
  {
    key: "price",
    label: "بها",
  },
  // {
  //   key: "unit",
  //   label: "یەکە",
  // },
  {
    key: "amount",
    label: "عدد",
  },
  {
    key: "item_name",
    label: "ناڤ",
  },
  {
    key: "number",
    label: "ژ",
  },
];

export default function Selling({}: Props) {
  const { user } = useContext(UserContext) as UserContextType;
  const {
    invoiceItems,
    addInvoiceItem,
    totalPriceOfInvoice,
    clearInvoice,
    gifft,
    invoiceCost,
    submitInvoice,
    prevInvoice,
    invoiceId,
    nextInvoice,
    invoiceType,
    updateInvoiceType,
  } = useContext(InvoiceContext) as InvoiceContextType;

  const [selectedInvoiceItem, setSelectedInvoiceItem] =
    useState<InvoiceItemType | null>(null);
  const [state, setState] = useState({
    barcode: "",
  });
  const [paymentMethodId, setPaymentMethodId] = useState<number>(0);

  const navigate = useNavigate();

  const loadPaymentMethods = async () => {
    const resp = await get_active_payment_methods();
    resp?.data &&
      setPaymentMethodId(
        resp.data.find((m: PaymentMethod) => m.def).payment_method_id
      );
  };

  const setSelectedPaymentMethod = (id: number) => {
    setPaymentMethodId(id);
  };

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else {
      loadPaymentMethods();
    }
  }, []);

  const handlePrint = () => {
    var printWindow = window.open("", "", "width=400,height=600");

    // @ts-ignore
    const rowsToPrint = invoiceItems?.map((row) => {
      let dynamicProps = {};
      // @ts-ignore
      columns.forEach((column) => {
        // @ts-ignore
        dynamicProps[column.key] = row[column.key];
      });
      return dynamicProps;
    });
    const beg = `
      <table class='bottom-table' dir='rtl'>
        <thead>
          <tr>
            <th>ژ.فاتورێ</th>
            <th>مێژوو</th>
            <th>دەم</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${invoiceId}</td>
            <td>${extractDateFromDate(new Date())}</td>
            <td>${extractTimeFromDate(new Date())}</td>
          </tr>
        </tbody>
      </table>
      `;

    const end = `
      <table class='bottom-table'>
        <thead>
          <tr>
            <th>بهایێ فاتورێ</th>
            <th>ظریبە</th>
            <th>داشکاندن</th>
            <th>دیاری</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>${formatNumberWithComma(totalPriceOfInvoice)}</td>
            <td>0</td>
            <td>0</td>
            <td>${formatNumberWithComma(gifft)}</td>
          </tr>
        </tbody>
      </table>
    `;
    const columnsToPrint = columns;

    const page = generateHtmlForPrinting({
      columnsToPrint,
      rowsToPrint,
      beg,
      end,
    });
    // @ts-ignore
    printWindow.document.write(page);
    // @ts-ignore
    printWindow.document.close();
    // @ts-ignore
    printWindow.print();
    // @ts-ignore
    printWindow.close();
  };

  // console.log(paymentMethodId)
  // const [selectedKeys, setSelectedKeys] = useState(new Set([]))
  return (
    <main className="w-screen min-h-screen bg-gray-200 grid grid-cols-12">
      {/* left side of screen 60% */}
      <div className="col-span-6 px-6 pt-6 	flex flex-col">
        {/* barcode and invoice price */}
        <div className="flex items-center	gap-x-8	">
          {invoiceType === "sale" ? (
            <p
              dir="ltr"
              className="w-72 justify-self-start text-green-800 font-bold text-3xl tracking-wide"
            >
              {formatNumberWithComma(totalPriceOfInvoice - gifft)}
              <sub className="text-gray-500 font-normal	text-sm	"> IQD</sub>
            </p>
          ) : (
            <div className={`w-80 flex items-center	gap-x-2 pl-4`}>
              <FaCartArrowDown className="text-[32px] text-yellow-700" />
              <span className="text-yellow-700">زڤراندن</span>
              <span className="font-bold text-yellow-700">
                {formatNumberWithComma(totalPriceOfInvoice - gifft)}
                <sub className="font-normal	text-sm	"> IQD</sub>
              </span>
            </div>
          )}
          <Input
            autoFocus
            dir="ltr"
            type="text"
            className="w-full bg-white"
            variant="bordered"
            id="barcode"
            size="lg"
            radius="none"
            style={{
              textAlign: "left",
              letterSpacing: "1.5px",
              fontWeight: "600",
              fontSize: "1.2rem",
              // borderRadius: '8px'
            }}
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
                // findItemByBarcode()
                if (state.barcode) {
                  addInvoiceItem(state.barcode);
                  setState({ ...state, barcode: "" });
                }
              }
            }}
          />
        </div>
        {/* invoice table */}
        <div className="mt-2">
          <Table
            // selectedKeys={selectedKeys}
            // onRowAction={(rowNumber) => {
            //   setSelectedInvoiceItem(invoiceItems.find(i => i.number == rowNumber) || null)
            // }}
            onSelectionChange={(keys) => {
              // console.log(keys)
              // @ts-ignore
              const valuesIterator = keys.values();
              const firstElement = valuesIterator.next().value;
              // console.log(firstElement);
              // for (const value of keys.values())
              //   console.log(value)

              firstElement
                ? setSelectedInvoiceItem(
                    invoiceItems.find((i) => i.number == firstElement) || null
                  )
                : setSelectedInvoiceItem(null);
            }}
            // color="secondary"
            isHeaderSticky
            aria-label="invoice items table"
            // radius='sm'
            selectionMode="single"
            // selectionBehavior='toggle'
            className="text-right"
            classNames={{
              base: "max-h-[460px] overflow-auto",
              // table: "min-h-[420px]",
            }}
          >
            <TableHeader columns={columns} className={`rounded-none`}>
              {(column) => (
                <TableColumn
                  className={`bg-gray-800 text-right text-white text-base rounded-none`}
                  key={column.key}
                >
                  {column.label}
                </TableColumn>
              )}
            </TableHeader>
            <TableBody items={invoiceItems}>
              {(item) => (
                <TableRow key={item.number}>
                  {(columnKey) =>
                    columnKey == "price" ? (
                      <TableCell>
                        {formatNumberWithComma(getKeyValue(item, columnKey))}
                      </TableCell>
                    ) : columnKey == "subtotal" ? (
                      <TableCell className="flex justify-items-end	">
                        <span className="mr-2">
                          <DeleteInvoiceItem
                            key={item.number}
                            rowNumber={item.number}
                          />
                        </span>
                        <span className="mr-2">
                          <ChangeAmount
                            itemNumber={item.number}
                            variant="icon"
                            availableAmount={item.total_available_pcs}
                            validQuantityToReturn={
                              item.valid_quantity_to_return
                            }
                            invoiceType={invoiceType}
                          />
                        </span>
                        {formatNumberWithComma(getKeyValue(item, columnKey))}
                      </TableCell>
                    ) : (
                      <TableCell>{getKeyValue(item, columnKey)}</TableCell>
                    )
                  }
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        {/* cards */}
        <div className="mt-auto flex gap-4">
          <article className="bg-sky-800 text-white px-4 py-2 rounded-md shadow-md">
            <h3 className="font-bold text-base">کوێ گشتی</h3>
            <div className="mt-2 font-medium	">
              {formatNumberWithComma(totalPriceOfInvoice)}
            </div>
          </article>
          <article className="bg-sky-800 text-white px-4 py-2 rounded-md shadow-md">
            <h3 className="font-bold text-base">Tax / ظریبە</h3>
            <div className="mt-2 font-medium	">{formatNumberWithComma(0)}</div>
          </article>
          <article className="bg-sky-800 text-white px-4 py-2 rounded-md shadow-md">
            <h3 className="font-bold">
              {invoiceType === "sale" ? "پێهێلان" : "برین"}
            </h3>
            <div className="mt-2 font-medium	">
              {formatNumberWithComma(gifft)}
            </div>
          </article>
          <article className="bg-sky-800 text-white px-4 py-2 rounded-md shadow-md">
            <h3 className="font-bold">داشکاندن</h3>
            <div className="mt-2 font-medium	">{formatNumberWithComma(0)}</div>
          </article>
        </div>
      </div>

      {/* right side of screen 40% */}
      <div className="col-span-6 pt-6 pr-6	">
        {/* printing, new, delete */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <Button
            radius="none"
            size="lg"
            className="bg-forestGreen text-white w-full"
            onClick={() =>
              submitInvoice({ userId: user?.user_id || 0, paymentMethodId })
            }
          >
            خەزنکرن
          </Button>
          <Button
            radius="none"
            size="lg"
            variant={invoiceType === "sale" ? "bordered" : "solid"}
            className={`${
              invoiceType === "sale"
                ? "bg-gray-700 text-white "
                : "text-gray-700 "
            } w-full`}
            onClick={() => {
              updateInvoiceType("sale");
            }}
          >
            فروتن
          </Button>
          <Button
            radius="none"
            size="lg"
            variant={invoiceType === "return" ? "bordered" : "solid"}
            className={`${
              invoiceType === "return"
                ? "bg-yellow-700 text-white "
                : "text-yellow-700 "
            } w-full`}
            onClick={() => {
              updateInvoiceType("return");
            }}
          >
            زڤراندن
          </Button>
        </div>
        <div className="grid grid-cols-3 gap-2 mb-2">
          <Button
            radius="none"
            size="lg"
            className="bg-forestGreen text-white w-full "
            startContent={<FiPrinter />}
            onClick={() => {
              if (invoiceItems.length > 0) handlePrint();
            }}
          >
            Print
          </Button>

          <Button
            radius="none"
            size="lg"
            className="text-white w-full bg-indigo-600"
            onClick={clearInvoice}
          >
            فاتورەکا نی
          </Button>
          <Button
            isDisabled
            radius="none"
            size="lg"
            color="primary"
            className=" text-white w-full "
            onClick={clearInvoice}
          >
            پاقژکرن
          </Button>
        </div>
        {/* search items, and invoices, discounts */}
        <div className="grid grid-cols-3 gap-2 mb-2">
          <InvoiceSearch />
          <Button
            isDisabled
            radius="none"
            size="lg"
            className="bg-forestGreen text-white w-full"
          >
            لێگەرینا مادەی
          </Button>
          <Button
            isDisabled
            radius="none"
            size="lg"
            className="bg-forestGreen text-white w-full"
          >
            داشکاندن
          </Button>
        </div>
        {/* 7 8 9 */}
        <div className="grid grid-cols-9 gap-2 mb-2">
          <Button
            radius="none"
            size="lg"
            className="bg-stone-800 text-white w-full col-span-2"
            onClick={() => setState({ ...state, barcode: state.barcode + "7" })}
          >
            <Fa7 />
          </Button>
          <Button
            radius="none"
            size="lg"
            className="bg-stone-800 text-white w-full col-span-2"
            onClick={() => setState({ ...state, barcode: state.barcode + "8" })}
          >
            <Fa8 />
          </Button>
          <Button
            radius="none"
            size="lg"
            className="bg-stone-800 text-white w-full col-span-2"
            onClick={() => setState({ ...state, barcode: state.barcode + "9" })}
          >
            <Fa9 />
          </Button>
          <SelectingPaymentModel
            setSelectedPaymentMethod={setSelectedPaymentMethod}
          />
        </div>
        {/* 4 5 6 */}
        <div className="grid grid-cols-9 gap-2 mb-2">
          <Button
            radius="none"
            size="lg"
            className="bg-stone-800 text-white w-full col-span-2"
            onClick={() => setState({ ...state, barcode: state.barcode + "4" })}
          >
            <Fa4 />
          </Button>
          <Button
            radius="none"
            size="lg"
            className="bg-stone-800 text-white w-full col-span-2"
            onClick={() => setState({ ...state, barcode: state.barcode + "5" })}
          >
            <Fa5 />
          </Button>
          <Button
            radius="none"
            size="lg"
            className="bg-stone-800 text-white w-full col-span-2"
            onClick={() => setState({ ...state, barcode: state.barcode + "6" })}
          >
            <Fa6 />
          </Button>
          <Button
            isDisabled
            radius="none"
            size="lg"
            className="bg-forestGreen text-white w-full col-span-3"
          >
            پاشئێخستنا پارەی
          </Button>
        </div>
        {/* 1 2 3 */}
        <div className="grid grid-cols-9 gap-2 mb-2">
          <Button
            radius="none"
            size="lg"
            className="bg-stone-800 text-white w-full col-span-2"
            onClick={() => setState({ ...state, barcode: state.barcode + "1" })}
          >
            <Fa1 />
          </Button>
          <Button
            radius="none"
            size="lg"
            className="bg-stone-800 text-white w-full col-span-2"
            onClick={() => setState({ ...state, barcode: state.barcode + "2" })}
          >
            <Fa2 />
          </Button>
          <Button
            radius="none"
            size="lg"
            className="bg-stone-800 text-white w-full col-span-2"
            onClick={() => setState({ ...state, barcode: state.barcode + "3" })}
          >
            <Fa3 />
          </Button>
          <ChangeAmount
            itemNumber={selectedInvoiceItem?.number || 0}
            variant="button"
          />
        </div>
        {/* . 0 00  */}
        <div className="grid grid-cols-9 gap-2 mb-2">
        <Button
            radius="none"
            size="lg"
            className="bg-stone-700 text-white w-full col-span-2"
            onClick={() => {
              if (state.barcode) {
                setState({ ...state, barcode: "" });
              }
            }}
          >
            Clear
          </Button>
          <Button
            radius="none"
            size="lg"
            className="bg-stone-800 text-white w-full col-span-2"
            onClick={() => setState({ ...state, barcode: state.barcode + "0" })}
          >
            <Fa0 />
          </Button>
          <Button
            radius="none"
            size="lg"
            className="bg-stone-800 text-white w-full col-span-2"
            onClick={() =>
              setState({ ...state, barcode: state.barcode + "00" })
            }
          >
            00
          </Button>
          <Gifft />
        </div>
        {/* up, enter, dashboard */}
        <div className="grid grid-cols-12 gap-x-2 mb-2">
          <Button
            radius="none"
            size="lg"
            className={`bg-gray-700 text-white w-full col-span-3`}
            onClick={() => prevInvoice()}
          >
            <TiArrowSortedUp className="text-5xl	" />
          </Button>
          <Button
            radius="none"
            size="lg"
            className="bg-stone-700 text-white  w-full col-span-5"
            onClick={() => {
              // @ts-ignore
              const input: HTMLInputElement | null =
                document.getElementById("barcode");
              input?.focus();
              input?.select();
              if (state.barcode) {
                addInvoiceItem(state.barcode);
                setState({ ...state, barcode: "" });
              }
            }}
          >
            Enter
          </Button>
          {/* main (dashboard) */}
          <Button
            isDisabled={user?.role !== "admin"}
            radius="none"
            size="lg"
            className="bg-forestGreen text-white w-full col-span-4"
            onClick={() => navigate("/app/dashboard")}
          >
            سەرەکی
          </Button>
        </div>
        {/* down, back, clear,  */}
        <div className="grid grid-cols-9 gap-2 mb-2">
          <Button
            radius="none"
            size="lg"
            className="bg-gray-700 text-white w-full col-span-2"
            onClick={() => nextInvoice()}
          >
            <TiArrowSortedDown className="text-5xl	" />
          </Button>
          <Button
            radius="none"
            size="lg"
            className="bg-gray-600 text-white w-full col-span-2"
            onClick={() => {
              if (state.barcode) {
                setState({ ...state, barcode: state.barcode.slice(1) });
              }
            }}
          >
            Del
          </Button>
          <Button
            radius="none"
            size="lg"
            className="bg-gray-600 text-white w-full col-span-2"
            onClick={() => {
              if (state.barcode) {
                setState({ ...state, barcode: state.barcode.slice(0, -1) });
              }
            }}
          >
            Backspace
          </Button>
          <Button
            radius="none"
            size="lg"
            className="bg-forestGreen text-white w-full col-span-3"
            onClick={() => navigate("/")}
          >
            <IoIosLogOut />
            دەرکەتن
          </Button>
        </div>
      </div>
      <footer className="col-span-12 items-center self-end flex justify-between bg-forestGreen text-white flex p-2 shadow-md">
        {/* time and date */}
        <div className="flex ml-4 items-center">
          <p className="text-left text-sm mr-4">
            {new Date().toLocaleDateString()}
          </p>
          <p className="text-left text-sm">{extractTimeFromDate(new Date())}</p>
          <div className="flex ml-4 items-center">
            <Button
              radius="none"
              size="sm"
              variant="light"
              isIconOnly
              className="text-white"
              style={{ padding: "0px" }}
              onClick={() => prevInvoice()}
            >
              <BiSolidLeftArrow className="p-0" />
            </Button>
            <p className="text-sm px-2">{formatNumberWithComma(invoiceId)}</p>
            <Button
              radius="none"
              size="sm"
              variant="light"
              isIconOnly
              className="text-white"
              style={{ padding: "0px" }}
              onClick={() => nextInvoice()}
            >
              <BiSolidRightArrow className="p-0" />
            </Button>
          </div>
        </div>
        {user?.role == "admin" && (
          <div>{formatNumberWithComma(invoiceCost)}</div>
        )}
        <div className="flex gap-2 mr-4">
          <span className="capitalize">{user?.user_name}</span>
          <Avatar
            style={{ width: "25px", height: "25px" }}
            src="assets/avatar-15.png"
          />
        </div>
      </footer>
    </main>
  );
}
