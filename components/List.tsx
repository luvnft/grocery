import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'

export type AisleData = {
    name: string,
    items: string[]
}

export default function List(sectionData?: AisleData[]) {
    // const supabase = createClientComponentClient();

    // const {
    //     data: { user },
    //   } = await supabase.auth.getUser()

    const HeaderComponent = (header: string) => {
        return (
                <a id={header} className="text-lg font-bold">{header}</a>
        );
    }
    const ItemComponent = (item: string, index: number) => {
        return (
                <p key={index} className="text-base">{item}</p>
        );
    }

    const sectionDataList = sectionData ? sectionData.map((aisle) => {
        const aisleName = aisle.name;
        const items = aisle.items.map((item, index) => {
            return ItemComponent(item, index);
        });
        return (
            <div key={"section"+aisleName}>
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