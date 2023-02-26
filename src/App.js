import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import {
    publicRoutes,
    // privateRoutes
} from '~/routes';
import DefaultLayout from '~/layouts';
import { Fragment } from 'react';
import GlobalComponents from './components/GlobalComponents/GlobalComponents';

function App() {
    return (
        <Router>
            <div className='App'>
                <Routes>
                    {publicRoutes.map((route) => {
                        let Layout = DefaultLayout;
                        if (route.layout) {
                            Layout = route.layout;
                        } else if (route.layout === null) {
                            Layout = Fragment;
                        }
                        return (
                            <Route
                                key={route.id}
                                path={route.path}
                                element={
                                    <Layout>
                                        <route.component />
                                    </Layout>
                                }
                            />
                        );
                    })}
                    {/* {privateRoutes.map((route) => (
                        <Route
                            key={route.id}
                            path={route.path}
                            element={<route.component />}
                        />
                    ))} */}
                </Routes>
            </div>
            {/* GLOBAL COMPONENTS */}
            <GlobalComponents />
        </Router>
    );
}

export default App;
