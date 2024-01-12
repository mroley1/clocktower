import { GameContext } from '@/components/App';
import '@/components/Menus.scss';
import { ElementType, ReactElement, useContext, useEffect, useState } from 'react';
import { TokenContext } from '../Token';
import { AilmentTypes } from '@/common/AilmentTypes';
import ActionType from '@/common/action/ActionType';
import { ChooseType } from '@/common/action/ChooseType';
import Player from '@/common/Player';
import Role from '@/common/Role';

function Action(props: any) {
    
    const gameContext = useContext(GameContext)
    const tokenContext = useContext(TokenContext)
    
    const [selectedAction, setSelectedAction] = useState("")
    interface SelectionsType {
        id: number
        type: ChooseType
        goodEvil: AilmentTypes | null
        number: number | null
        yesNo: boolean | null
        player: Player | null
        self: Player | null
        role: Role | null
    }
    const init: SelectionsType[] = []
    const [selectionsMade, setSelectionsMade] = useState(false)
    const [selections, setSelections] = useState(init)
    
    function closeMenu() {
        tokenContext.util.closeMenu()
    }
    
    function ActionSelect() {
        return (
            <div id='radialMenuActionSolidBase'>
            <div className='close' onClick={closeMenu}></div>
            <div className='center'>
                <h1>What Action Does {tokenContext.json.name} Take?</h1>
                <div className='large_options'>
                    {tokenContext.json.role?.actions.map((action)=>{
                        const iconType = action.possibleAilments[0].ailmentType
                        const Icon = AilmentTypes.svg(iconType)
                        return (
                            <div key={action.title} className='option' title={action.title} onClick={()=>{setSelectedAction(action.title)}}>
                                <Icon fill={"white"}></Icon>
                            </div>
                        )
                    })}
                    
                </div>
            </div>
        </div>
        )
    }
    
    function ActionTake({action}: {action: ActionType}) {
        
        const animate = (() => {
            if (tokenContext.json.role?.actions.length === 1) {
                return ""
            } else {
                return "noanimate"
            }
        })()
        
        function SingletonNotification() {
            if (action.singleton && tokenContext.json.usedActions.includes(action.title)) {
                return <h4 style={{color: "red"}}>This action should only be used once and has already been used!</h4>
            } else {
                return null
            }
        }
        
        function GoodEvilSelect() {
            const relevant = action.choices.find((choice) => choice.type===ChooseType.GOODEVIL)
            if (relevant) {
                return <div className='item'>{relevant.title}</div>
            } else {
                return null
            }
        }
        
        function NumberSelect() {
            const relevant = action.choices.find((choice) => choice.type===ChooseType.NUMBER)
            if (relevant) {
                return <div className='item'>{relevant.title}</div>
            } else {
                return null
            }
        }
        
        function PlayerSelect() {
            const relevant = action.choices.find((choice) => choice.type===ChooseType.PLAYER)
            if (relevant) {
                return <div className='item'>{relevant.title}</div>
            } else {
                return null
            }
        }
        
        function RoleSelect() {
            const relevant = action.choices.find((choice) => choice.type===ChooseType.ROLE)
            if (relevant) {
                return <div className='item'>{relevant.title}</div>
            } else {
                return null
            }
        }
        
        function SelfSelect() {
            const relevant = action.choices.find((choice) => choice.type===ChooseType.SELF)
            if (relevant) {
                return <div className='item'>{relevant.title}</div>
            } else {
                return null
            }
        }
        
        function YesNoSelect({val, mutator}:{val: SelectionsType, mutator: (newVal: SelectionsType)=>void}) {
            
            const relevant = action.choices[val.id]
            
            function no() {
                const tmp = {...val}
                tmp.yesNo = false
                mutator(tmp)
            }
            
            function yes() {
                const tmp = {...val}
                tmp.yesNo = true
                mutator(tmp)
            }
            
            if (relevant) {
                console.log(selections[1])
                console.log(val)
                return (
                    <div className='item'>
                        <div className='title'>{relevant.title}</div>
                        <div className='content'>
                            <div className='item' style={{backgroundColor: val.yesNo===false?"rgb(170, 43, 43)":"rgb(130, 43, 43)"}} onClick={no}>No</div> // ! LOGIC HERE OFF
                            <div className='item' style={{backgroundColor: val.yesNo===true?"rgb(43, 170, 43)":"rgb(43, 130, 43)"}} onClick={yes}>Yes</div>
                        </div>
                    </div>
                )
            } else {
                return null
            }
        }
        
        
        const selectionMap = new Map<ChooseType, ElementType>()
        selectionMap.set(ChooseType.GOODEVIL, GoodEvilSelect)
        selectionMap.set(ChooseType.NUMBER, NumberSelect)
        selectionMap.set(ChooseType.PLAYER, PlayerSelect)
        selectionMap.set(ChooseType.ROLE, RoleSelect)
        selectionMap.set(ChooseType.SELF, SelfSelect)
        selectionMap.set(ChooseType.YESNO, YesNoSelect)
        
        const selectionElements = action.choices.map((choice, index) => {
            const Element = selectionMap.get(choice.type)!
            // ! THIS NEEDS TO BE AN INITILIZING VALUE NOT ONE THAT IS REDEFINED
            const val: SelectionsType = {
                id: index,
                type: choice.type,
                goodEvil: null,
                number: null,
                yesNo: null,
                player: null,
                role: null,
                self: null
            }
            const mutator = (newVal: SelectionsType) => {
                let tmp = Array.from(selections)
                let selectionIndex = tmp.findIndex((entry)=>entry.id===index)
                tmp[selectionIndex] = newVal
                setSelections(tmp)
            }
            if (!selections.find((selection)=>selection.id === index)) {
                let tmp = Array.from(selections)
                tmp.push(val)
                setSelections(tmp)
            }
            return <Element key={index} val={val} mutator={mutator}></Element>
        })
        
        return (
            <div id='radialMenuActionSolidBase' className={animate}>
            <div className='close' onClick={closeMenu}></div>
            <div className='center'>
                <h1>{action.title}</h1>
                <SingletonNotification></SingletonNotification>
                <div className='scroll_list'>
                    {selectionElements}
                </div>
            </div>
        </div>
        )
    }
    
    function ActionComplete() {
        return (
            <div id='radialMenuActionSolidBase' className='noanimate'>
            <div className='close' onClick={closeMenu}></div>
            <div className='center'>
                <h1>complete</h1>
            </div>
        </div>
        )
    }
    
    useEffect(() => {
        
    }, [])
    
    
    if (tokenContext.json.role?.actions.length === 0) {
        return null
    } else if (selectionsMade) {
        return <ActionComplete></ActionComplete>
    } else if (tokenContext.json.role?.actions.length === 1) {
        return <ActionTake action={tokenContext.json.role?.actions[0]}></ActionTake>
    } else if (selectedAction) {
        return <ActionTake action={tokenContext.json.role?.actions.find((action) => action.title===selectedAction)!}></ActionTake>
    } else {
        return <ActionSelect></ActionSelect>
    }
}

export default Action;
