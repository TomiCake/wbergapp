import React, { Component } from 'react';
import TimetableView from '../TimetableView';
import SearchView from '../SearchView';
import TimetableViewPublic from '../TimetableView/index.public';
import appConfig from '../../appconfig';

export default appConfig.mode === 'app' ? TimetableView : TimetableViewPublic;