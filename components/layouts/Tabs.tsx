import React, { useState } from 'react';
import { Icon } from 'components';
import { BaseColor } from 'types';

export type TabOption = {
    label?: string,
    iconName?: string,
    iconFill?: boolean,
    iconStroke?: boolean,
    color: BaseColor,
    action: () => void,
}

interface TabsProps {
    tabs: TabOption[],
    className?: string,
}

export const Tabs: React.FC<TabsProps> = (props: TabsProps) => {
    const [selectedTab, setSelectedTab] = useState(0);

    const getIconClassName = (tab: TabOption, selected: boolean) => {
        let classes = '';
        if (!selected) {
            if (tab.iconFill) classes += 'fill-grey-light ';
            if (tab.iconStroke) classes += 'stroke-grey-light ';
            return classes;
        }
        switch (tab.color) {
            case 'main':
                if (tab.iconFill) classes += 'fill-main ';
                if (tab.iconStroke) classes += 'stroke-main ';
                break;
            case 'second':
                if (tab.iconFill) classes += 'fill-second ';
                if (tab.iconStroke) classes += 'stroke-second ';
                break;
            case 'third':
                if (tab.iconFill) classes += 'fill-third ';
                if (tab.iconStroke) classes += 'stroke-third ';
                break;
        }
        return classes;
    }
    const getLabelClassName = (tab: TabOption, selected: boolean) => {
        let classes = '';
        if (!selected) {
            classes += 'text-grey-light ';
            return classes;
        }
        switch (tab.color) {
            case 'main':
                classes += 'text-main ';
                break;
            case 'second':
                classes += 'text-second ';
                break;
            case 'third':
                classes += 'text-third ';
                break;
        }
        return classes;
    }
    const getBorderClassName = (tab: TabOption, selected: boolean) => {
        if (!selected) return ' border-grey-light'
        switch (tab.color) {
            case 'main': return ' border-main';
            case 'second': return ' border-second';
            case 'third': return ' border-third';
        }
    }

    return (
        <div className={'flex flex-row w-full justify-around ' + (props.className ? props.className : '')}>
            
            {props.tabs.map((tab, index) => {
                const selected = selectedTab === index;
                return (
                    <div 
                        key={tab.iconName}
                        className={'cursor-pointer w-full flex justify-center border-b-2 pb-2' + getBorderClassName(tab, selected)}
                        onClick={() => {
                            setSelectedTab(index);
                            tab.action();
                        }}
                    >
                        {tab.iconName &&
                            <Icon 
                                name={tab.iconName}
                                SVGClassName={'h-8 w-8 ' + getIconClassName(tab, selected)}
                            />
                        }
                        {tab.label &&
                            <div className={'ktext-label ' + getLabelClassName(tab, selected)}>{tab.label}</div>
                        }
                    </div>
                )
            })}
        
        </div>
    )
}