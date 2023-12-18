"use client"
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useState, useMemo } from 'react';

export type AisleData = {
    name: string,
    items: string[]
}

export default function List(sectionData?: AisleData[], setShowAuth?: (shouldShowAuth: boolean) => void) {
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

    const onClick = async () => {
        // TODO: add login + auth!
        const supabase = createClientComponentClient()
        const {
            data: { session },
          } = await supabase.auth.getSession()
        if (session) {
            console.log('we are logged in!');
        } else {
            if (setShowAuth) {
                setShowAuth(true);
            }
        }
    }

    const sendMeButton = sectionData ? (
        <button onClick={onClick} className="font-PermanentMarker text-white bg-spilltNavy py-1.5 px-4 rounded-full">
            Send Me the List
        </button>
    ) : (<></>);

    return (
        <span key={"section data list"}>
            {sectionDataList}
            {sectionData && sectionData.length > 0 && sendMeButton}
        </span>
    )
}