
export type AisleData = {
    name: string,
    items: string[]
}

export default function List(sectionData?: AisleData[]) {

    const HeaderComponent = (header: string) => {
        return (
                <p id={header} className="text-lg text-spilltNavy text-center font-PermanentMarker flex-1 mb-2">{header}</p>
        );
    }
    const ItemComponent = (item: string, index: number) => {
        return (
                <p key={index} className="text-base text-black text-center mb-1.5">{item}</p>
        );
    }

    const sectionDataList = sectionData ? sectionData.map((aisle) => {
        const aisleName = aisle.name;
        const items = aisle.items.map((item, index) => {
            return ItemComponent(item, index);
        });
        return (
            <div className={"flex flex-col items-center justify-center mb-4"} key={"section"+aisleName}>
                {HeaderComponent(aisleName)}
                {items}
            </div>
        )
    }) : (<></>);

    return (
        <span key={"section data list"}>
            {sectionDataList}
        </span>
    )
}