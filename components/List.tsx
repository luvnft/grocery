export type AisleData = {
    name: string,
    items: string[]
}

export default function List(sectionData?: AisleData[]) {
    // const sectionData = [
    //     {
    //         "name" : "Dairy",
    //         "items": [
    //         "milk",
    //         "eggs",
    //         "cottage cheese",
    //     ]},
    //     {
    //         "name": "Baking",
    //         "items": [
    //             "flour",
    //             "granulated sugar",
    //             "brown sugar",
    //         ]
    //     }
    // ]

    const HeaderComponent = (header: string) => {
        return (
                <p className="text-lg font-bold">{header}</p>
        );
    }
    const ItemComponent = (item: string) => {
        return (
                <p className="text-base">{item}</p>
        );
    }

    const sectionDataList = sectionData?.map((aisle) => {
        const aisleName = aisle.name;
        const items = aisle.items.map((item) => {
            return ItemComponent(item);
        });
        return (
            <>
            {HeaderComponent(aisleName)}
            {items}
            </>
        )
    })

    return (
        <>
        {sectionDataList}
        </>
    )
}