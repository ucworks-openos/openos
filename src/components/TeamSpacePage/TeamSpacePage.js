import React from 'react'

function TeamSpacePage() {
    return (
        <div>
            <div dangerouslySetInnerHTML={{ __html: iframe }} />
        </div>
    )
}

const iframe = '<iframe src="" width="540" height="450"></iframe>';

export default TeamSpacePage
