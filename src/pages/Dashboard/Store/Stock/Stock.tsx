import { Button, Input, Spinner } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { Stock } from "../../../../types/Stock.types";
import { get_last_stock_by_barcode } from "../../../../services/general_queries_service";
import { UserContext, UserContextType } from "../../../../contexts/UserContext";
import toast, { Toaster } from "react-hot-toast";
import { add_new_stock } from "../../../../services/stocks_service";
import Ajv from "ajv";

const ajv = new Ajv({ allErrors: true });
type Props = {};

const schema = {
  type: "object",
  properties: {
    item_id: { type: "integer", minimum: 1 },
    pc_cost: { type: "number", minimum: 1 },
    pc_price: { type: "integer", minimum: 1 },
    amount_in_pcs: { type: "number", minimum: 1 },
    user_id: { type: "integer", minimum: 1 },
    stocking_note: { type: "string", maxLength: 100, nullable: true }
  },
  required: ["item_id", "pc_cost", "pc_price", "amount_in_pcs", "user_id"],
  additionalProperties: true,
};

const validate = ajv.compile(schema);

export default function Stocking({}: Props) {
  const navigate = useNavigate();

  const { user } = useContext(UserContext) as UserContextType;

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

  const [pcBarcode, setPcBarcode] = useState("");
  const [loading, setLoading] = useState(false);

  const [state, setState] = useState({
    total_available_pcs: 0,
    item_name: "",
    item_id: 0,
    pc_barcode: "",
    pc_cost: 0,
    pc_price: 0,
  });

  const [stockState, setStockState] = useState<Stock>({
    amount_in_pcs: 0,
    pc_cost: 0,
    pc_price: 0,
    expire_date: null,
    stocking_note: "",
    pc_barcode: "",
    user_id: 0,
  });

  const findLastStockByBarcode = async () => {
    try {
      const res = await get_last_stock_by_barcode(pcBarcode);

      // local state
      res?.data?.length !== 0 &&
        setStockState({
          ...stockState,
          pc_cost: res?.data[0]?.pc_cost,
          pc_price: res?.data[0]?.pc_price,
          pc_barcode: res?.data[0]?.pc_barcode,
        });

      res?.data?.length !== 0 &&
        setState({
          total_available_pcs: res?.data[0]?.total_available_pcs,
          item_name: res?.data[0]?.item_name,
          item_id: res?.data[0]?.item_id,
          pc_barcode: res?.data[0]?.pc_barcode,
          pc_cost: res?.data[0]?.pc_cost,
          pc_price: res?.data[0]?.pc_price,
        });

      res?.data?.length === 0 &&
        setStockState({
          amount_in_pcs: 0,
          pc_cost: 0,
          pc_price: 0,
          expire_date: null,
          stocking_note: "",
          pc_barcode: "",
          user_id: 0,
        });

      res?.data?.length === 0 &&
        setState({
          total_available_pcs: 0,
          item_name: "",
          item_id: 0,
          pc_barcode: "",
          pc_cost: 0,
          pc_price: 0,
        });
    } catch (error) {
      console.log(error);
    }
  };

  const addNewStock = async () => {
    setLoading(true);
    // const amounInUnits = (stockState.pcs / state.pcs_per_unit) + stockState.amount_in_units
    const data = {
      item_id: state.item_id,
      unit_cost: 0,
      unit_price: 0,
      pc_cost: state.pc_cost,
      pc_price: state.pc_price,
      amount_in_units: 0,
      amount_in_pcs: stockState.amount_in_pcs,
      pcs_per_unit: 0,
      user_id: user?.user_id ? user.user_id : 0,
      stocking_note: stockState.stocking_note,
      barcode: "",
      pc_barcode: state.pc_barcode,
    };

    if (validate(data)) {
      // @ts-ignore
      data.expire_date = stockState.expire_date;
      // @ts-ignore
      data.production_date = undefined;
      try {
        notify("خەزنکرن...");
        const response = await add_new_stock(data);
        if (response?.status === 201) {
          notify(`هاتە خەزنکرن ب شوەکێ سەرکەفتی.`);
          try {
            let res;
            if (stockState.pc_barcode)
              res = await get_last_stock_by_barcode(stockState.pc_barcode);

            res?.data?.length !== 0 &&
              setStockState({
                ...stockState,
                // unit_cost: res?.data[0]?.unit_cost,
                // unit_price: res?.data[0]?.unit_price,
                pc_cost: res?.data[0]?.pc_cost,
                pc_price: res?.data[0]?.pc_price,
                // barcode: res?.data[0]?.barcode,
                // pc_barcode: res?.data[0]?.pc_barcode,
                // item_id: res?.data[0]?.item_id,
              });

            res?.data?.length !== 0 &&
              setState({
                ...state,
                total_available_pcs: res?.data[0]?.total_available_pcs,
                pc_cost: res?.data[0]?.pc_cost,
                pc_price: res?.data[0]?.pc_price,
              });
          } catch (error) {}
        } else {
          notify(`نەشێت سەر زێدەکەت`);
        }
      } catch (error) {
        console.log(error);
        notify(`نەشێت سەر زێدەکەت`);
      }
    } else {
      notify(
        "ئەڤ زانیاریێن تە داخلکرین کێم و کوری یا تێدا، هیڤیدارین بهێنە پشتراستکرن."
      );
      console.log(validate.errors);
    }
    setLoading(false);
  };
  // console.log(stockState)
  // console.log(state)
  const notify = (msg: string) => toast(msg);
  return (
    <main dir="rtl" className="px-8 py-1 bg-white h-lvh">
      <Toaster reverseOrder={true} />
      <header className="flex justify-between	px-2 items-center">
        <h3 className="font-bold">سەر زێدەکرن (تعبیە)</h3>
        <Button
          onClick={() => navigate(-1)}
          color="warning"
          variant="light"
          endContent={<MdArrowBack style={{ fontSize: "20px" }} />}
        >
          Back
        </Button>
      </header>
      <div className="grid grid-cols-2 p-8 max-w-5xl ml-auto items-center gap-6">
        {/* right side */}
        <div className="flex flex-col gap-y-3 border-dashed	border-green-950	border-e min-w-[300px]">
          {/* item: barcode */}
          <div className="flex gap-x-4">
            <Input
              dir="ltr"
              type="text"
              label="بارکود"
              className="w-72"
              size="md"
              labelPlacement="inside"
              id="item-barcode"
              radius="sm"
              style={{ textAlign: "left" }}
              value={pcBarcode}
              onChange={(e) => setPcBarcode(e.target.value)}
              onKeyDown={(e) => {
                // barcode steps: Tab key ==> barcode value ==> Enter key
                if (e.key === "Tab") {
                  e.preventDefault(); // Prevent default behavior
                }
                if (e.key === "Enter") {
                  findLastStockByBarcode();
                  // @ts-ignore
                  const input: HTMLInputElement | null =
                    document.getElementById("item-barcode");
                  input?.focus();
                  input?.select();
                }
              }}
            />
          </div>
          {/* stock */}
          {/* pcs */}
          <Input
            size="md"
            dir="ltr"
            type="number"
            label={`عدد`}
            className="w-72"
            labelPlacement="inside"
            radius="sm"
            color="primary"
            min={1}
            style={{ textAlign: "left" }}
            value={String(stockState.amount_in_pcs)}
            onChange={(e) =>
              setStockState({
                ...stockState,
                amount_in_pcs: Number(e.target.value),
              })
            }
          />
          {/* expire date */}
          <Input
            color="danger"
            type="date"
            variant="bordered"
            label={`مێژویا سەرڤەچونێ`}
            labelPlacement="inside"
            radius="sm"
            size="md"
            className='w-72'
            // @ts-ignore
            value={
              stockState.expire_date
                ? new Date(stockState.expire_date).toISOString().slice(0, 10)
                : ""
            }
            onChange={(e) =>
              setStockState({
                ...stockState,
                expire_date: new Date(e.target.value),
              })
            }
          />
          {/* note */}
          <Input
            type="text"
            label="تێبینی"
            labelPlacement="inside"
            radius="sm"
            size="md"
            className='w-72'
            variant="bordered"
            color="success"
            value={stockState.stocking_note}
            onChange={(e) =>
              setStockState({ ...stockState, stocking_note: e.target.value })
            }
          />
          {/* cost of pc */}
          <Input
            dir="ltr"
            isRequired
            type="number"
            color="success"
            size="md"
            label={`بهایێ کرینێ`}
            className="w-72"
            labelPlacement="inside"
            radius="sm"
            style={{ textAlign: "left" }}
            value={String(stockState.pc_cost)}
            onChange={(e) =>
              setStockState({ ...stockState, pc_cost: Number(e.target.value) })
            }
          />
          {/* price of pc */}
          <Input
            dir="ltr"
            isRequired
            type="number"
            size="md"
            label={`بهایێ فروتنێ`}
            className="w-72"
            labelPlacement="inside"
            radius="sm"
            style={{ textAlign: "left" }}
            value={String(stockState.pc_price)}
            onChange={(e) =>
              setStockState({ ...stockState, pc_price: Number(e.target.value) })
            }
          />
        </div>
        {/* left side */}
        <div className="flex flex-col gap-y-3 self-start justify-self-start">
          {/* item details */}
          <article style={{textAlign: 'right'}}>
            <h4 className="inline-block border-b-2 border-gray-600 mb-2 font-semibold">
              پێزانین سەرەکی
            </h4>
            <p>
              ناڤ: <strong>{state.item_name}</strong>
            </p>
            <p>
              عددێ مای: <strong>{state.total_available_pcs}</strong>
            </p>
            <p>
              بهایێ کرینێ: <strong>{state.pc_cost}</strong>
            </p>
            <p>
              بهایێ فروتنێ: <strong>{state.pc_price}</strong>
            </p>
            <p>
              بارکود: <strong>{state.pc_barcode}</strong>
            </p>
          </article>
        </div>
        {/* action buttons */}
        <div className="col-start-2 col-end-2 flex gap-2" dir='ltr'>
          <Button color="warning" onClick={() => navigate(-1)}>
            Back
          </Button>
          {loading ? (
            <Spinner size="md" />
          ) : (
            <Button color="primary" onClick={addNewStock}>
              Save
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
