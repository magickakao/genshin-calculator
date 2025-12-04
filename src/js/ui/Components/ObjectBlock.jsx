import React from 'react';
import "../../../css/Components/ObjectBlock.css"

import { Stats } from '../../classes/Stats';
import { Lang } from '../Lang';
import { CharIcon, EnemyIcon, WeaponIcon } from './Icons';
import { NumberInput } from './Inputs/Input';
import { Slider } from './Inputs/Slider';
import { BetaWarning } from './TextBlocks';
import { getSkillLevelByName } from '../../classes/Build/Settings';

const levelItems = [
    {level: 1,  ascension: 0, maxLevel: 20},
    {level: 20, ascension: 0, maxLevel: 20},
    {level: 20, ascension: 1, maxLevel: 40},
    {level: 40, ascension: 1, maxLevel: 40},
    {level: 40, ascension: 2, maxLevel: 50},
    {level: 50, ascension: 2, maxLevel: 50},
    {level: 50, ascension: 3, maxLevel: 60},
    {level: 60, ascension: 3, maxLevel: 60},
    {level: 60, ascension: 4, maxLevel: 70},
    {level: 70, ascension: 4, maxLevel: 70},
    {level: 70, ascension: 5, maxLevel: 80},
    {level: 80, ascension: 5, maxLevel: 80},
    {level: 80, ascension: 6, maxLevel: 90},
    {level: 90, ascension: 6, maxLevel: 90},
    
    // НОВОЕ: диапазон 90-95
    {level: 90, ascension: 6, maxLevel: 95},
    {level: 95, ascension: 6, maxLevel: 95},
    
    // НОВОЕ: диапазон 95-100
    {level: 95, ascension: 6, maxLevel: 100},
    {level: 100, ascension: 6, maxLevel: 100},
];

export class CharObjectBlock extends React.Component {
    constructor(props) {
        super(props);

        this.lang = new Lang();

        this.strings = {
            skill_attack: this.lang.get('object_view.skill_attack'),
            skill_elemental: this.lang.get('object_view.skill_elemental'),
            skill_burst: this.lang.get('object_view.skill_burst'),
            constellation: this.lang.get('object_view.constellation'),
        };
    }

    render() {
        return (
            <>
                <ObjectBlock>
                    <CharIcon
                        char={this.props.char}
                        onClick={this.props.onObjectChange}
                    />
                    <ObjectAscended
                        title={this.lang.get(this.props.char.getName())}
                        level={this.props.settings.char_level}
                        ascension={this.props.settings.char_ascension}
                        onLevelChange={this.props.onLevelChange}
                        maxLevel={100}  // ПЕРСОНАЖИ: до 100 уровня
                    />
                </ObjectBlock>
                {this.props.char.isBeta() ? <BetaWarning /> : null}
                <LevelLine
                    title={this.strings.skill_attack}
                    value={this.props.skills.attack}
                    cappedValue={this.props.settings.char_skill_attack}
                    bonus={getSkillLevelByName('char_skill_attack', this.props.settings) - this.props.settings.char_skill_attack}
                    onChange={(value) => this.props.onSkillChange({attack: value})}
                    onInfo={() => this.props.onInfoClick('attack')}
                    maxValue={10}
                />
                <LevelLine
                    title={this.strings.skill_elemental}
                    value={this.props.skills.elemental}
                    cappedValue={this.props.settings.char_skill_elemental}
                    bonus={getSkillLevelByName('char_skill_elemental', this.props.settings) - this.props.settings.char_skill_elemental}
                    onChange={(value) => this.props.onSkillChange({elemental: value})}
                    onInfo={() => this.props.onInfoClick('skill')}
                    maxValue={10}
                />
                <LevelLine
                    title={this.strings.skill_burst}
                    value={this.props.skills.burst}
                    cappedValue={this.props.settings.char_skill_burst}
                    bonus={getSkillLevelByName('char_skill_burst', this.props.settings) - this.props.settings.char_skill_burst}
                    onChange={(value) => this.props.onSkillChange({burst: value})}
                    onInfo={() => this.props.onInfoClick('burst')}
                    maxValue={10}
                />
                <LevelLine
                    title={this.strings.constellation}
                    value={this.props.settings.char_constellation}
                    onChange={(value) => this.props.onLevelChange({constellation: value})}
                    minValue={0}
                    maxValue={6}
                />
            </>
        );
    }
}

export class WeaponObjectBlock extends React.Component {
    constructor(props) {
        super(props);

        this.lang = new Lang();

        this.strings = {
            refine: this.lang.get('object_view.weapon_refine'),
        };
    }

    render() {
        let stats = [];
        let level = this.props.settings.weapon_level;
        let ascension = this.props.settings.weapon_ascension;

        for (const stat of this.props.weapon.statTable) {
            let name = stat.getName();

            stats.push(
                <tr key={name} className="weapon-stats">
                    <td className="name">{this.lang.getStat('stat.'+ name)}</td>
                    <td className="value">{Stats.format(name, stat.getValue(level, ascension))}</td>
                </tr>
            );
        }

        return (
            <>
                <ObjectBlock>
                    <WeaponIcon
                        weapon={this.props.weapon}
                        onClick={this.props.onObjectChange}
                    />
                    <ObjectAscended
                        title={this.lang.get(this.props.weapon.getName())}
                        level={level}
                        ascension={ascension}
                        onLevelChange={this.props.onLevelChange}
                        maxLevel={90}  // ОРУЖИЕ: остаётся до 90
                    />
                </ObjectBlock>
                {this.props.weapon.isBeta() ? <BetaWarning /> : null}
                <LevelLine
                    title={this.strings.refine}
                    value={this.props.settings.weapon_refine}
                    onChange={(value) => this.props.onLevelChange({refine: value})}
                    minValue={1}
                    maxValue={5}
                />
                <table>
                    <tbody>{stats}</tbody>
                </table>
            </>
        );
    }
}

export class EnemyObjectBlock extends React.Component {
    constructor(props) {
        super(props);

        this.lang = new Lang();

        this.strings = {
            level: this.lang.get('object_view.level')
        };
    }

    render() {
        let enemy = this.props.enemy;
        let level = this.props.settings.enemy_level;
        let enemyName = enemy ? enemy.getName() : 'modal_window.enemy_custom';

        return (
            <>
                <ObjectBlock>
                    <EnemyIcon
                        enemy={this.props.enemy}
                        onClick={this.props.onObjectChange}
                    />
                    <div className="info">
                        <ObjectName name={this.lang.get(enemyName)} />
                        <div className="level">
                            <div className="level-name">{this.strings.level}</div>
                            <div className="level-manual">
                                <NumberInput
                                    minValue={1}
                                    maxValue={110}
                                    nonEmpty={true}
                                    value={level}
                                    onChange={this.props.onLevelChange}
                                    addClass="level-input-3"
                                />
                            </div>
                            <div className="level-slider">
                                <Slider
                                    min={1}
                                    max={110}
                                    value={level}
                                    onChange={this.props.onLevelChange}
                                />
                            </div>
                        </div>
                    </div>
                </ObjectBlock>
            </>
        );
    }
}

function ObjectBlock(props) {
    return (
        <div className="calc-object-block">
            {props.children}
        </div>
    );
}

class ObjectAscended extends React.Component {
    constructor(props) {
        super(props);
        this.lang = new Lang();
    }

    handleLevelChange(level) {
        // 1. Если поле пустое — ставим 1 уровень
        if (!level) {
            this.props.onLevelChange({
                level: 1,
                ascension: 0,
            });
            return;
        }

        // 2. Преобразуем в число (на всякий случай)
        level = parseInt(level) || 1;
        
        // 3. НАХОДИМ СТУПЕНЬКУ ТОЛЬКО ДЛЯ ОПРЕДЕЛЕНИЯ ВОЗВЫШЕНИЯ
        let index = getLevelIndex(level, this.props.ascension, this.props.maxLevel);
        let data = levelItems[index];

        // 4. УСТАНАВЛИВАЕМ:
        this.props.onLevelChange({
            level: level,  // ← ВОТ ОНО! Сохраняем ТОЧНО ТУ ЦИФРУ, которую ввёл пользователь!
            ascension: data ? data.ascension : (level > 90 ? 6 : 0),
        });
    }

    handleSliderChange(index) {
        // Ограничиваем индекс для оружия
        if (this.props.maxLevel === 90) {
            let maxIndex = levelItems.length - 1;
            for (let i = levelItems.length - 1; i >= 0; i--) {
                if (levelItems[i].maxLevel <= 90) {
                    maxIndex = i;
                    break;
                }
            }
            index = Math.min(index, maxIndex);
        }
        
        let item = levelItems[index];
        this.props.onLevelChange({
            level: item.level,  // Для ползунка берём уровень из ступеньки
            ascension: item.ascension,
        });
    }

    render() {
        let stars = [];
        for (let i = 1; i <= 6; ++i) {
            stars.push(<div key={'star'+ i} className={'star'+ (this.props.ascension >= i ? ' active' : '')}/>);
        }

        let levelIndex = getLevelIndex(this.props.level, this.props.ascension, this.props.maxLevel);
        
        // ОГРАНИЧЕНИЕ ДЛЯ ОРУЖИЯ
        let maxSliderIndex = levelItems.length - 1;
        let displayLevelIndex = levelIndex;

        if (this.props.maxLevel === 90) {
            // Находим последний индекс с maxLevel <= 90
            for (let i = levelItems.length - 1; i >= 0; i--) {
                if (levelItems[i].maxLevel <= 90) {
                    maxSliderIndex = i;
                    break;
                }
            }
            displayLevelIndex = Math.min(levelIndex, maxSliderIndex);
        }

        let levelData = levelItems[displayLevelIndex];

        return (
            <div className="info">
                <ObjectName name={this.props.title} />
                <div className="stars">{stars}</div>
                <div className="level">
                    <div className="level-name">{this.lang.get('object_view.level')}</div>
                    <div className="level-manual">
                        <NumberInput
                            minValue={1}
                            maxValue={this.props.maxLevel || 90}
                            nonEmpty={true}
                            value={this.props.level}
                            onChange={(value) => this.handleLevelChange(value)}
                            addClass="level-input"
                        />
                        <div className="level-max">/{this.props.maxLevel || 90}</div>
                    </div>
                    <div className="level-slider">
                        <Slider
                            min={0}
                            max={maxSliderIndex}
                            value={displayLevelIndex}
                            onChange={(index) => this.handleSliderChange(index)}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

class ObjectName extends React.Component {
    componentDidUpdate() {
        this.checkLength()
    }

    componentDidMount() {
        this.checkLength()
    }

    checkLength() {
        let classList = this.block.parentElement.classList;
        classList.remove('shrink');
        classList.remove('shrink2');
        classList.remove('shrink3');
        classList.remove('overflow');

        let maxWidth = this.block.closest('.tab-content').clientWidth - 103;
        if (!maxWidth) {
            return;
        }

        if (this.block.clientWidth > maxWidth) {
            classList.add('shrink');
            if (this.block.clientWidth > maxWidth) {
                classList.remove('shrink');
                classList.add('shrink2');
                if (this.block.clientWidth > maxWidth) {
                    classList.remove('shrink2');
                    classList.add('shrink3');
                }
            }
            classList.add('overflow');
        }
    }

    render() {
        return (
            <div ref={obj => this.block = obj} className={'name'}>{this.props.name}</div>
        );
    }
}

function LevelLine(props) {
    let displayValue = props.value;
    let markValue = false;

    if (props.cappedValue && props.cappedValue < props.value) {
        displayValue = props.cappedValue;
        markValue = true;
    }

    return (
        <div className="levels-line">
            <div className="info">
                {props.onInfo ? <div className="skill" onClick={props.onInfo}>i</div> : null}
            </div>
            <div className="title">{props.title}</div>
            <div className="value">{markValue ? <span className="invalid">{displayValue}</span> : displayValue}</div>
            <div className="bonus">
                <span className="gi-foreground-text">+{props.bonus || 0}</span>
            </div>
            <div className="line-slider">
                <Slider
                    min={props.minValue === undefined ? 1 : props.minValue}
                    max={props.maxValue}
                    value={props.value}
                    onChange={props.onChange}
                />
            </div>
        </div>
    );
}

export function EnemyLevelLine(props) {
    let displayValue = props.value;
    let markValue = false;

    if (props.cappedValue && props.cappedValue < props.value) {
        displayValue = props.cappedValue;
        markValue = true;
    }

    return (
        <div className="levels-line">
            <div className="info">
                {props.onInfo ? <div className="skill" onClick={props.onInfo}>i</div> : null}
            </div>
            <div className="title">{props.title}</div>
            <div className="value-bonus">{markValue ? <span className="invalid">{displayValue}</span> : displayValue}</div>
            <div className="line-slider">
                <Slider
                    min={props.minValue === undefined ? 1 : props.minValue}
                    max={props.maxValue}
                    value={props.value}
                    onChange={props.onChange}
                />
            </div>
        </div>
    );
}

function getLevelIndex(level, ascension, maxLevel = 90) {
    let items = levelItems;
    
    // ПРОСТО ИЩЕМ ПОДХОДЯЩИЙ ДИАПАЗОН
    for (let i = items.length - 1; i >= 0; i--) {
        let item = items[i];
        
        // Если уровень попадает в диапазон этого элемента
        if (level >= item.level && level <= item.maxLevel) {
            return i;
        }
    }
    
    // Если не нашли — возвращаем первый элемент
    return 0;
}

export function getLevelData(level, ascension, maxLevel = 90) {
    let levelIndex = getLevelIndex(level, ascension, maxLevel);
    if (levelIndex < 0) {
        return;
    }

    return levelItems[levelIndex];
}