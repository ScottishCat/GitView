import Link from 'next/link'
import {Icon} from 'antd'
import moment from 'moment'

function getLicense(license) {
    return license ? `${license.spdx_id} license` : ''
}

function getLastUpdate(time) {
    return moment(time).fromNow()
}

export default ({repo}) => {
    console.log(repo)
    return (
        <div className='root'>
            <div className='basic-info'>
                <h3 className='title'>
                    <Link href={`/detail?owner=${repo.owner.login}&name=${repo.name}`}>
                        <a>{repo.full_name}</a>
                    </Link>
                </h3>
                <p className='repo-desc'>{repo.description}</p>
                <p className='other-info'>
                    <span className='last-updated'>{getLastUpdate(repo.updated_at)}</span>
                    <span className='open-issues'>{repo.open_issues_count} issues</span>
                    {
                        repo.license ? <span className='license'>{getLicense(repo.license)}</span> : null
                    }
                </p>
            </div>
            <div className='detail-info'>
                <span className='language'>{repo.language}</span>
                <span className='star'>{repo.stargazers_count} 
                    <Icon type='star' theme='filled'/>
                </span>
            </div>
            <style jsx>{`
            .root {
                display : flex;
                justify-content : space-between;
            }

            .root + .root {
                border-top : 1px solid #EEE;
                padding-top : 20px
            }

            .other-info > span + span {
                margin-left : 10px
            }

            .title {
                font-size : 20px
            }

            .detail-info {
                display : flex;
            }

            .detail-info > span {
                width : 120px;
                text-align : right;
            }

            .repo-desc {
                width : 400px
            }
        `}</style>
        </div>
    )
}