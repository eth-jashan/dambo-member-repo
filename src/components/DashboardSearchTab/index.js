import React, { useState } from 'react'
import { MdOutlineFilterAlt, BiSearchAlt2 } from 'react-icons/all'
import { Dropdown, Menu } from 'antd'
import crossSvg from '../../assets/Icons/cross_white.svg'
import searchSvg from '../../assets/Icons/white_search.svg'
import styles from './styles.module.css'
import textStyles from '../../commonStyles/textType/styles.module.css'
import { useDispatch, useSelector } from 'react-redux'
import { set_contri_filter, set_payout_filter } from '../../store/actions/dao-action'

const DashboardSearchTab = ({route}) => {

    const contribution_request = useSelector(x=>x.dao.contribution_request)
    const [contriFilter, setContriFilter] = useState(1)
    const [search, setSearch] = useState(false)
    
    const contri_filter = ['All requests', 'Active requests', 'Approved requests', 'Paid requests' ]
    const payout_filter = ['All requests','Pending Payment Request', 'Approved requests','Paid requests','Rejected requests' ]

    const [payoutFilter, setPayoutFilter] = useState(1)

    const dispatch = useDispatch()
    const onClick = ({ key }) => {
        if(key === '1'){
            setContriFilter(0)
            dispatch(set_contri_filter('ALL'))
            // setNumRequest(contribution_request.length)
        }else if(key === '2'){
            dispatch(set_contri_filter('ACTIVE'))
            setContriFilter(1)
        }else if(key === '3'){
            dispatch(set_contri_filter('APPROVED'))
            setContriFilter(2)
        }else if(key === '4'){
            // setNumRequest(contribution_request.length)
            // setContriFilter(3)
        }
    };

    const payoutOnClick = ({ key }) => {

        if(key === '1'){
            setPayoutFilter(0)
            dispatch(set_payout_filter('ALL'))
        }else if(key === '2'){
            dispatch(set_payout_filter('PENDING'))
            setPayoutFilter(1)
        }else if(key === '3'){
            dispatch(set_payout_filter('APPROVED'))
            setPayoutFilter(2)
        }else if(key === '4'){
            dispatch(set_payout_filter('PAID'))
            setPayoutFilter(3)
        }else if(key === '5'){
            dispatch(set_payout_filter('REJECTED'))
            setPayoutFilter(4)
        }
    };

    const contriMenu = (
        <Menu  style={{borderRadius:'8px',width:'15.813rem', background:'#1F1F1F', paddingTop:'1rem', paddingBottom:'1rem'}} onClick={onClick}>
          <Menu.Item className={styles.menuContainer} key="1">
          <div className={styles.menu}>All requests</div>
          </Menu.Item>
          <Menu.Item className={styles.menuContainer} key="2">
          <div className={styles.menu}>Active requests</div>  
          </Menu.Item>
          <Menu.Item className={styles.menuContainer} key="3">
          <div className={styles.menu}>Approved requests</div>  
          </Menu.Item>
          <Menu.Item className={styles.menuContainer} key="4">
          <div className={styles.menu}>Paid requests</div>  
          </Menu.Item>
        </Menu>
      );

      const payoutMenu = (
        <Menu  style={{borderRadius:'8px',width:'15.813rem', background:'#1F1F1F', paddingTop:'1rem', paddingBottom:'1rem'}} onClick={payoutOnClick}>
          <Menu.Item className={styles.menuContainer} key="1">
          <div className={styles.menu}>All requests</div>
          </Menu.Item>
          <Menu.Item className={styles.menuContainer} key="2">
          <div className={styles.menu}>Pending Payment Request</div>  
          </Menu.Item>
          <Menu.Item className={styles.menuContainer} key="3">
          <div className={styles.menu}>Approved requests</div>  
          </Menu.Item>
          <Menu.Item className={styles.menuContainer} key="4">
          <div className={styles.menu}>Paid requests</div>  
          </Menu.Item>
          <Menu.Item className={styles.menuContainer} key="5">
          <div className={styles.menu}>Rejected requests</div>  
          </Menu.Item>
        </Menu>
      );
    
      const renderSearchBar = () => (
          <div className={styles.searchContainer}>
              <input placeholder='Search for requests' />
              <div style={{display:'flex', flexDirection:'row', height:'100%', alignItems:'center'}}>
                <img onClick={()=>setSearch(false)} src={crossSvg} alt='cross' className={styles.crossIcon} />
                <div style={{width:'1px', height:'100%', background:'white', opacity:0.12, marginLeft:'0.75rem', marginRight:'0.75rem'}} />
                <img src={searchSvg} alt='cross' className={styles.searchIcon} />
              </div>
          </div>
        )

    return(
        
        <div className={styles.container}>
            <Dropdown  overlay={route==='contributions'?contriMenu:payoutMenu}>
            <div className={`${textStyles.m_16} ${styles.text}`}>
                {route==='contributions'?`${contribution_request?.length} ${contri_filter[contriFilter]}`:`${payout_filter[payoutFilter]}`}
            </div>
            </Dropdown>
            <div style={{display:'flex', flexDirection:'row'}}>
                {!search?
                <div onClick={()=>setSearch(true)} className={styles.icon}>
                    <BiSearchAlt2 color='#808080' size='1rem'  />
                </div>:
                renderSearchBar()}
                <div className={styles.icon}>
                    <MdOutlineFilterAlt color='#808080' size='1rem'  />
                </div>
            </div>
        </div>
    )

}

export default DashboardSearchTab