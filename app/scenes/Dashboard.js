// @flow
import * as React from 'react';
import { Switch, Route } from 'react-router-dom';
import { observer, inject } from 'mobx-react';
import styled from 'styled-components';

import DocumentsStore from 'stores/DocumentsStore';
import AuthStore from 'stores/AuthStore';
import NewDocumentMenu from 'menus/NewDocumentMenu';
import Actions, { Action } from 'components/Actions';
import InputSearch from 'components/InputSearch';
import CenteredContent from 'components/CenteredContent';
import PageTitle from 'components/PageTitle';
import Tabs from 'components/Tabs';
import Tab from 'components/Tab';
import PaginatedDocumentList from '../components/PaginatedDocumentList';
import TeamFilmstrip from '../components/TeamFilmstrip';

const Intro = styled.p`
  font-size: 1.5rem;
  margin-bottom: 1.5em;
`

type Props = {
  documents: DocumentsStore,
  auth: AuthStore,
};

@observer
class Dashboard extends React.Component<Props> {
  render() {
    const { documents, auth } = this.props;
    if (!auth.user || !auth.team) return null;
    const user = auth.user.id;

    return (
      <CenteredContent>
        <PageTitle title="Home" />
        <h1>Learn from our best work</h1>
        <Intro>Explore examples of our work, find templates to get started quickly, read and write guides.</Intro>
        <TeamFilmstrip/>
        <Tabs>
          <Tab to="/home" exact>
            Recently updated
          </Tab>
          <Tab to="/home/recent" exact>
            Recently viewed
          </Tab>
          <Tab to="/home/created">Created by me</Tab>
        </Tabs>
        <Switch>
          <Route path="/home/recent">
            <PaginatedDocumentList
              key="recent"
              documents={documents.recentlyViewed}
              fetch={documents.fetchRecentlyViewed}
              showCollection
            />
          </Route>
          <Route path="/home/created">
            <PaginatedDocumentList
              key="created"
              documents={documents.createdByUser(user)}
              fetch={documents.fetchOwned}
              options={{ user }}
              showCollection
            />
          </Route>
          <Route path="/home">
            <PaginatedDocumentList
              documents={documents.recentlyUpdated}
              fetch={documents.fetchRecentlyUpdated}
              showCollection
            />
          </Route>
        </Switch>
        <Actions align="center" justify="flex-end">
          <Action>
            <InputSearch />
          </Action>
          <Action>
            <NewDocumentMenu />
          </Action>
        </Actions>
      </CenteredContent>
    );
  }
}

export default inject('documents', 'auth')(Dashboard);
