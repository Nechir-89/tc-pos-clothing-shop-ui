import { Button, Input, Spinner } from "@nextui-org/react";
import { Autocomplete, AutocompleteItem } from "@nextui-org/react";
import AddCategory from "../../../../components/AddCategory";
import { useNavigate } from "react-router-dom";
import { MdArrowBack } from "react-icons/md";
import { useContext, useEffect, useState } from "react";
import { get_categories } from "../../../../services/categories_service";
import { Category } from "../../../../types/Category.types";
import { UserContext, UserContextType } from "../../../../contexts/UserContext";
import { Item } from "../../../../types/Items.types";
import Ajv from "ajv";
import { Stock } from "../../../../types/Stock.types";
import { add_new_item } from "../../../../services/items_service";
import toast, { Toaster } from "react-hot-toast";

const ajv = new Ajv({ allErrors: true });

const itemSchema = {
  type: "object",
  properties: {
    item_name: { type: "string", maxLength: 100, minLength: 3 },
    user_id: { type: "integer", minimum: 1 },
    category_id: { type: "integer", minimum: 1 },
    archived: { type: "boolean" },
  },
  required: ["item_name", "user_id", "category_id", "archived"],
  additionalProperties: false,
};

const stockSchema = {
  type: "object",
  properties: {
    pc_cost: { type: "number", minimum: 1 },
    pc_price: { type: "integer", minimum: 1 },
    amount_in_pcs: { type: "number", minimum: 1 },
    // expire_date: { type: "string", format: 'date-time', nullable: false },
    user_id: { type: "integer", minimum: 1 },
    stocking_note: { type: "string", maxLength: 100, nullable: true },
    pc_barcode: { type: "string", maxLength: 100, nullable: true },
  },
  required: ["pc_cost", "pc_price", "amount_in_pcs", "user_id", "pc_barcode"],
  additionalProperties: false,
};

const validateItem = ajv.compile(itemSchema);
const validateStock = ajv.compile(stockSchema);

type Props = {};

type InputingItemType = {
  item_name: string;
};

export default function NewItem({}: Props) {
  const navigate = useNavigate();

  const { user } = useContext(UserContext) as UserContextType;

  useEffect(() => {
    if (!user) {
      navigate("/");
    }
  }, []);

  const [loading, setLoading] = useState(true);

  const [categories, setCategories] = useState<Category[] | []>([]);
  const [category, setCategory] = useState("");
  const [itemState, setItemState] = useState<InputingItemType>({
    item_name: "",
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

  const listCategories = async () => {
    try {
      const res = await get_categories();
      setCategories(res?.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    listCategories();
    setLoading(false);
  }, []);

  const addNewItem = async () => {
    setLoading(true);
    const selectedCategory =
      category &&
      categories.find((cat: Category) => cat.category_name === category);
    // new item data
    const newItemData: Item = {
      item_name: itemState.item_name,
      user_id: user?.user_id ? user?.user_id : 0,
      category_id: selectedCategory ? selectedCategory.category_id : 0,
      archived: false,
    };

    // new stock data
    const newStockData: Stock = {
      pc_cost: stockState.pc_cost,
      pc_price: stockState.pc_price,
      amount_in_pcs: stockState.amount_in_pcs,
      user_id: user?.user_id ? user?.user_id : 0,
      stocking_note: stockState.stocking_note,
      pc_barcode: stockState.pc_barcode,
    };

    console.log(newItemData);
    console.log(newStockData);

    if (validateItem(newItemData)) {
      if (validateStock(newStockData)) {
        newStockData.expire_date = stockState.expire_date;
        newStockData.production_date = undefined;
        const data = {
          ...newItemData,
          ...newStockData,
        };
        notify("خەزنکرن...");
        const resp = await add_new_item(data);
        if (resp?.status === 201) {
          notify(`هاتە خەزنکرن ب شوەکێ سەرکەفتی.`);
          setItemState({
            item_name: ""
          });

          setStockState({
            amount_in_pcs: 0,
            pc_cost: 0,
            pc_price: 0,
            expire_date: null,
            stocking_note: "",
            pc_barcode: "",
            user_id: user?.user_id ? user.user_id : 0
          });
        } else {
          notify(`نەشێت سەر زێدەکەت`);
        }
      } else {
        notify(
          "ئەڤ زانیاریێن تە داخلکرین (لایێ چەپێ) کێم و کوری یا تێدا، هیڤیدارین بهێنە پشتراستکرن."
        );
      }
    } else {
      notify(
        "ئەڤ زانیاریێن تە داخلکرین (لایێ راستێ) کێم و کوری یا تێدا، هیڤیدارین بهێنە پشتراستکرن."
      );
    }
    setLoading(false);
  };

  const notify = (msg: string) => toast(msg);

  return (
    <main dir="rtl" className="px-8 py-1 bg-white h-lvh">
      <Toaster reverseOrder={true} />
      <header className="flex justify-between	px-2 items-center">
        <h3 className="font-bold">زێدەکرن بو جارا ئێکێ</h3>
        <Button
          onClick={() => navigate(-1)}
          color="warning"
          variant="light"
          endContent={<MdArrowBack style={{ fontSize: "20px" }} />}
        >
          Back
        </Button>
      </header>
      <div className="grid grid-cols-2 p-8 ml-auto items-center gap-6">
        {/* right side */}
        <div className="flex flex-col gap-y-3 border-dashed	border-green-950	border-e">
          {/* item: category */}
          <div className="flex items-center gap-y-4">
            <Autocomplete
              isRequired
              size="md"
              label="بەش/صنف"
              className="w-72"
              // disableAnimation
              labelPlacement="inside"
              radius="sm"
              selectedKey={category}
              color="primary"
              // @ts-ignore
              onSelectionChange={setCategory}
            >
              {categories.map((category: Category) => (
                <AutocompleteItem
                  key={category.category_name}
                  value={category.category_name}
                >
                  {category.category_name}
                </AutocompleteItem>
              ))}
            </Autocomplete>
            <AddCategory revalidate={listCategories} />
          </div>
          {/* item: name */}
          <div>
            <Input
              isRequired
              type="text"
              label="ناڤ/اسم"
              className="w-72"
              // disableAnimation={true}
              color="success"
              variant="bordered"
              labelPlacement="inside"
              radius="md"
              value={String(itemState.item_name)}
              onChange={(e) =>
                setItemState({ ...itemState, item_name: e.target.value })
              }
            />
          </div>

          {/* stock */}
          {/* pcs */}
          <div>
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
          </div>
          {/* cost of pc */}
          <Input
            dir="ltr"
            isRequired
            type="number"
            color="success"
            variant="bordered"
            size="md"
            min={0}
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
            color="primary"
            label={`بهایێ فروتنێ`}
            className="w-72"
            labelPlacement="inside"
            radius="sm"
            style={{ textAlign: "left" }}
            min={0}
            value={String(stockState.pc_price)}
            onChange={(e) =>
              setStockState({ ...stockState, pc_price: Number(e.target.value) })
            }
          />
        </div>
        {/* left side */}
        <div className="flex flex-col gap-y-3 self-start">
          {/* item: barcode */}
          {/* item: pc barcode */}
          <Input
            id="new-pc-barcode"
            dir="ltr"
            type="text"
            label="بارکود"
            labelPlacement="inside"
            radius="sm"
            size="md"
            color="primary"
            style={{ textAlign: "left" }}
            value={stockState.pc_barcode}
            onChange={(e) =>
              setStockState({ ...stockState, pc_barcode: e.target.value })
            }
            onKeyDown={(e) => {
              // barcode steps: Tab key ==> barcode value ==> Enter key
              if (e.key === "Tab") {
                e.preventDefault(); // Prevent default behavior
              }
              if (e.key === "Enter") {
                // @ts-ignore
                const input: HTMLInputElement | null =
                  document.getElementById("new-pc-barcode");
                input?.focus();
                input?.select();
              }
            }}
          />
          {/* </div> */}
          {/* item: expire and note */}
          {/* <div className="flex gap-x-4"> */}
          {/* expire date */}
          <Input
            color="danger"
            type="date"
            variant="bordered"
            label={`مێژویا سەرڤەچونێ`}
            labelPlacement="inside"
            radius="sm"
            size="md"
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
            variant="bordered"
            color="success"
            value={stockState.stocking_note}
            onChange={(e) =>
              setStockState({ ...stockState, stocking_note: e.target.value })
            }
          />
          {/* </div> */}
        </div>
        {/* action buttons */}
        <div className="col-span-2 flex gap-x-4" dir="ltr">
          <Button color="warning" onClick={() => navigate(-1)}>
            Back
          </Button>
          {loading ? (
            <Spinner size="md" />
          ) : (
            <Button color="primary" onClick={addNewItem}>
              Save
            </Button>
          )}
        </div>
      </div>
    </main>
  );
}
