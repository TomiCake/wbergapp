import React, { Component } from 'react';

export interface AppBarProps {
    onSelect: () => void;
    openCalendar: () => void;
    isLoading: boolean;
}
export default class AppBar extends Component<AppBarProps>{}