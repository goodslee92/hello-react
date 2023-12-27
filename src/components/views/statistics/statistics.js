import React, { useState, useEffect } from "react";
import Select from "react-select"
import './statistics.scss';
import HeaderAmount from '../../common/header/header_amount';
import { addComma } from '../../../utils/numberUtils';
import Nav from '../../common/nav/nav'
import HeaderTitle from "../../common/header/header_title";
import axios from 'axios'


const Dropdown = () => {
    const options = [
        { value: "주간", label: "주간" },
        { value: "월간", label: "월간" },
        { value: "연간", label: "연간" }
    ]
    const [totalSum, setTotalSum ] = useState(0)
    const [totalIncome, setTotalIncome] = useState(0)
    const [totalOutcome, setTotalOutcome] = useState(0)
    const total = { sum: 0, income: 0, outcome: 0 }
    const data = {
        id: window.sessionStorage.getItem('loginUserId'),
        year: new Date().getFullYear()
    }
    const [financialList, setFinancialList] = useState()
    const [selectedPeriod, setSelectedPeriod] = useState('주간');
    const handleOnChange = (e) => {
        setSelectedPeriod(e.value);
        switch (selectedPeriod) {
            case '월간' :
                const currentMonth = new Date().getMonth() + 1
                const fetchMonthlyData = async () => {
                    await axios.post('http://localhost:3001/api/selectMonthlyItem', data)
                    .then(res => {
                        console.log(res.data)
                        // setFinancialList(res.data)
                    }).catch(err => {
                        console.log(err)
                    })
                }
                fetchMonthlyData()
                break
            case '연간' :
                const fetchYearlyData = async () => {
                    await axios.post('http://localhost:3001/api/selectYearlyItem', data)
                    .then(res => {
                        console.log(res.data)
                        // setFinancialList(res.data)
                    }).catch(err => {
                        console.log(err)
                    })
                }
                fetchYearlyData()
                break
            default :   
                 
        }
    }
    useEffect(() => {
        const fetchData = async () => {
            await axios.post('http://localhost:3001/api/selectMonthlyItem', data)
            .then(res => {
                console.log(res.data)
                setFinancialList(res.data)
            }).catch(err => {
                console.log(err)
            })
        }
        fetchData()
    }, [])
    const calcTotalIncome = () => {
        financialList && financialList.map((content, index) => {
            total.income += content.TOTAL_INCOME 
            total.outcome += content.TOTAL_OUTCOME
        })
        total.sum = total.income - total.outcome
        setTotalIncome(total.income)
        setTotalOutcome(total.outcome)
        setTotalSum(total.sum)
        console.log('total.income : ' + total.income + ', total.outcome : ' + total.outcome + ', total.sum : ' + total.sum)
    }
    useEffect(() => {
        calcTotalIncome()
    }, [financialList])
    return (
        <div className="statistics_root_container">
            <HeaderTitle />
            <Nav />
            <div className="statistics_container">
                <HeaderAmount income={totalIncome.toString()} outcome={totalOutcome.toString()} sum={totalSum.toString()}/>
                <div className="dropDown_container">
                    <div className="select_div">
                        <Select defaultValue={options[0]} options={options} className="select" onChange={handleOnChange} />
                    </div>
                </div>
                <div className="statistics_content_container">
                    {
                        financialList && financialList.map((content, index) => {
                            return (
                                <div className="row_container" key={index}>
                                    {console.log("selectedPeriod ; " + selectedPeriod)}
                                    <p className="date">
                                        {
                                            selectedPeriod === '주간' ? 
                                            '주간' : 
                                            (selectedPeriod === '월간' ? content.MONTH+'월' : content.YEAR+'년')
                                        }
                                    </p>
                                    <p className="income">
                                        +
                                        {
                                            selectedPeriod === '주간' ? 
                                            '주간' : 
                                            (selectedPeriod === '월간' ? addComma(content.TOTAL_INCOME.toString()) : addComma(content.TOTAL_INCOME.toString()))
                                        }
                                        원
                                    </p>
                                    <p className="outcome">-{addComma(content.TOTAL_OUTCOME.toString())}원</p>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
        </div>
    );
}

export default Dropdown